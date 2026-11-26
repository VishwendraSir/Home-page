#!/usr/bin/env python3
"""Non-blocking static audit for every HTML application in the repository."""
import argparse
import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", ".github", "node_modules", "vendor"}

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.ids = [], []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.append(a["id"])
        for key in ("href", "src", "action", "poster"):
            value = a.get(key)
            if value:
                self.links.append((tag, key, value))

def resolve_target(source, value):
    value = value.strip()
    if not value or value.startswith("#") or re.match(r"^(?:[a-z][a-z0-9+.-]*:|//)", value, re.I):
        return None, ""
    if any(x in value for x in ("\${", "{{", "}}", "<%", "%}", "'+", "'+")):
        return None, ""
    parts = urlsplit(value)
    raw = unquote(parts.path)
    # GitHub Pages project sites are mounted below /Home-page/ rather than the domain root.
    repo_root_path = raw.startswith("/Home-page/")
    if repo_root_path:
        raw = raw[len("/Home-page/"):]
    if not raw:
        return source, unquote(parts.fragment)
    target = (ROOT / raw.lstrip("/")) if (repo_root_path or raw.startswith("/")) else (source.parent / raw)
    target = target.resolve()
    if target.is_dir():
        target = target / "index.html"
    if not target.exists() and not target.suffix:
        for candidate in (target / "index.html", target.with_suffix(".html")):
            if candidate.exists():
                target = candidate
                break
    return target, unquote(parts.fragment)

html_files = sorted(p for p in ROOT.rglob("*.html") if not any(x in SKIP for x in p.relative_to(ROOT).parts))
catalogue_path = ROOT / "site-pages.json"
catalogue = json.loads(catalogue_path.read_text(encoding="utf-8")) if catalogue_path.exists() else []
catalogue_paths = {x.get("path") for x in catalogue}
actual_paths = {p.relative_to(ROOT).as_posix() for p in html_files}
missing_catalogue = sorted(actual_paths - catalogue_paths)
stale_catalogue = sorted(x for x in catalogue_paths - actual_paths if x)

broken, duplicate_ids, pages_with_parse_errors = [], [], []
id_cache = {}
for page in html_files:
    rel = page.relative_to(ROOT).as_posix()
    try:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8", errors="ignore"))
        parser.close()
        counts = Counter(parser.ids)
        for key, count in counts.items():
            if count > 1:
                duplicate_ids.append({"page": rel, "id": key, "count": count})
        id_cache[page.resolve()] = set(parser.ids)
    except Exception as exc:
        pages_with_parse_errors.append({"page": rel, "error": str(exc)})
        id_cache[page.resolve()] = set()

for page in html_files:
    rel = page.relative_to(ROOT).as_posix()
    # Archived copies are retained for recovery, but they are not live navigation paths.
    if rel.startswith(("archive/", "backups/")):
        continue
    try:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8", errors="ignore"))
        for tag, attr, value in parser.links:
            target, fragment = resolve_target(page, value)
            if target is None:
                continue
            if not target.exists():
                broken.append({"page": rel, "tag": tag, "attribute": attr, "target": value})
            elif fragment and target.suffix.lower() in (".html", ".htm") and fragment not in id_cache.get(target.resolve(), set()):
                broken.append({"page": rel, "tag": tag, "attribute": attr, "target": value, "issue": "missing-fragment"})
    except Exception:
        pass

report = {
    "html_pages_scanned": len(html_files),
    "catalogue_entries": len(catalogue),
    "missing_from_catalogue": missing_catalogue,
    "stale_catalogue_entries": stale_catalogue,
    "broken_local_references": broken,
    "duplicate_html_ids": duplicate_ids,
    "parse_errors": pages_with_parse_errors,
}
parser = argparse.ArgumentParser()
parser.add_argument("--output", default="/tmp/site-audit-report.json")
args = parser.parse_args()
Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("SITE AUDIT SUMMARY")
print(f"HTML pages scanned: {len(html_files)}")
print(f"Catalogue entries: {len(catalogue)}")
print(f"Pages missing from catalogue: {len(missing_catalogue)}")
print(f"Stale catalogue entries: {len(stale_catalogue)}")
print(f"Broken local references / fragments: {len(broken)}")
print(f"Duplicate HTML IDs: {len(duplicate_ids)}")
print(f"Parse errors: {len(pages_with_parse_errors)}")
print(f"Full report: {args.output}")
