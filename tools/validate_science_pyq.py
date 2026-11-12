#!/usr/bin/env python3
"""Strict structural and quality gate for the Science PYQ 2000 bank.

Expected file: Science_PYQ_2000_Master_Question_Bank.json
The validator deliberately does not infer or fabricate source verification.
"""
import json, re, sys, unicodedata
from collections import Counter, defaultdict
from pathlib import Path

BANK = Path(sys.argv[1] if len(sys.argv) > 1 else "Science_PYQ_2000_Master_Question_Bank.json")
TARGETS = {"Physics": 500, "Chemistry": 500, "Biology": 500, "Environment & Ecology": 500}

def norm(value):
    if isinstance(value, dict):
        value = " ".join(str(v) for v in value.values() if v is not None)
    value = unicodedata.normalize("NFKC", str(value or "")).casefold()
    return re.sub(r"[^\\w]+", "", value, flags=re.UNICODE)

def get_questions(data):
    if isinstance(data, list): return data
    if isinstance(data, dict):
        for key in ("questions", "items", "question_bank", "data"):
            if isinstance(data.get(key), list): return data[key]
    raise ValueError("JSON root must be a list or contain a questions/items/question_bank/data list")

def main():
    if not BANK.exists():
        raise SystemExit(f"FAIL: bank file not found: {BANK}")
    data = json.loads(BANK.read_text(encoding="utf-8"))
    qs = get_questions(data)
    errors, warnings = [], []
    ids, exact = set(), defaultdict(list)
    counts, classes = Counter(), Counter()
    for i, q in enumerate(qs, 1):
        if not isinstance(q, dict):
            errors.append(f"row {i}: question record is not an object"); continue
        qid = str(q.get("id", "")).strip()
        if not qid: errors.append(f"row {i}: missing id")
        elif qid in ids: errors.append(f"row {i}: duplicate id {qid}")
        ids.add(qid)
        subject = q.get("subject")
        if subject not in TARGETS: errors.append(f"{qid or i}: invalid subject {subject!r}")
        else: counts[subject] += 1
        question = q.get("question")
        if not question: errors.append(f"{qid or i}: missing question")
        key = norm(question)
        if key: exact[key].append(qid or str(i))
        options = q.get("options")
        if not isinstance(options, list) or len(options) != 4:
            errors.append(f"{qid or i}: must have exactly 4 options")
        elif len({norm(x) for x in options}) != 4:
            errors.append(f"{qid or i}: duplicate options")
        classification = q.get("classification") or q.get("source_type")
        if classification: classes[str(classification)] += 1
        if classification in ("VERIFIED_PYQ", "verified_pyq"):
            source_url = q.get("source_url") or (q.get("source") or {}).get("url") if isinstance(q.get("source"), dict) else q.get("source_url")
            evidence = q.get("answer_key_reference") or q.get("official_answer_key") or q.get("source_evidence")
            if not source_url: errors.append(f"{qid or i}: verified PYQ missing source URL")
            if not evidence: warnings.append(f"{qid or i}: verified PYQ has no explicit answer-key evidence field")
        if isinstance(question, dict) and not (question.get("hi") and question.get("en")):
            errors.append(f"{qid or i}: bilingual question must include hi and en")
        if isinstance(options, list):
            for j, opt in enumerate(options, 1):
                if isinstance(opt, dict) and not (opt.get("hi") and opt.get("en")):
                    errors.append(f"{qid or i}: option {j} missing hi/en")
        if not (q.get("explanation") or q.get("explanations")):
            errors.append(f"{qid or i}: missing explanation")
    for key, group in exact.items():
        if len(group) > 1: errors.append(f"exact duplicate question text: {', '.join(group)}")
    for subject, expected in TARGETS.items():
        if counts[subject] != expected:
            errors.append(f"{subject}: expected {expected}, found {counts[subject]}")
    if len(qs) != 2000: errors.append(f"total: expected 2000, found {len(qs)}")
    report = {
        "file": str(BANK), "total": len(qs), "subject_counts": dict(counts),
        "classification_counts": dict(classes), "unique_ids": len(ids),
        "exact_duplicate_groups": sum(1 for v in exact.values() if len(v) > 1),
        "warnings": warnings, "errors": errors,
        "status": "PASS" if not errors else "FAIL"
    }
    Path("science-pyq-qa-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(0 if not errors else 1)

if __name__ == "__main__": main()
