#!/usr/bin/env python3
"""Build page catalogue and wire the shared Firebase display-lock loader into HTML pages."""
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", ".github", "node_modules", "vendor"}
SKIP_FILES = {"404.html"}

def slug(value):
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))[:90]

def title_of(source, fallback):
    match = re.search(r"<title[^>]*>(.*?)</title>", source, re.I | re.S)
    if match:
        clean = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", match.group(1))).strip()
        return clean[:140] or fallback
    return fallback

items = []
updated = 0
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

    relative_root = os.path.relpath(ROOT, path.parent).replace(os.sep, "/")
    prefix = "./" if relative_root == "." else relative_root.rstrip("/") + "/"
    page_id = slug(rel.as_posix())
    fallback = path.stem.replace("_", " ").replace("-", " ").strip() or rel.as_posix()
    items.append({"id": page_id, "path": rel.as_posix(), "title": title_of(source, fallback)})

    if "site-lock.js" not in source:
        loader = (
            '\n<!-- SCLH shared Firebase display lock (automatically managed) -->\n'
            '<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>\n'
            '<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>\n'
            f'<script src="{prefix}firebase-config.js"></script>\n'
            f'<script src="{prefix}site-lock.js?v=2"></script>\n'
        )
        if re.search(r"</head>", source, re.I):
            source = re.sub(r"</head>", loader + "</head>", source, count=1, flags=re.I)
        else:
            source = loader + source
        path.write_text(source, encoding="utf-8")
        updated += 1

(ROOT / "site-pages.json").write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Indexed {len(items)} HTML pages; added shared lock loader to {updated} new pages")
