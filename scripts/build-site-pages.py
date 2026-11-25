#!/usr/bin/env python3
"""Generate a list of HTML pages for the Owner Lock dashboard."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", ".github", "node_modules", "vendor"}
SKIP_FILES = {"404.html"}

def title_of(text, fallback):
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
    if m:
        return re.sub(r"\\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()[:140] or fallback
    return fallback

items = []
for path in sorted(ROOT.rglob("*.html")):
    rel = path.relative_to(ROOT)
    if any(part in SKIP_DIRS for part in rel.parts) or path.name in SKIP_FILES:
        continue
    try:
        source = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        continue
    if rel.as_posix() == "owner-dashboard.html":
        continue
    fallback = path.stem.replace("_", " ").replace("-", " ").strip() or rel.as_posix()
    items.append({"path": rel.as_posix(), "title": title_of(source, fallback)})
(ROOT / "site-pages.json").write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
print(f"Indexed {len(items)} HTML pages")
