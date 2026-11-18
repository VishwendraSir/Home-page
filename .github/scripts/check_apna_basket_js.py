from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile

class ScriptExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.current = None
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script":
            attrs = dict(attrs)
            if "src" not in attrs:
                self.current = []
    def handle_data(self, data):
        if self.current is not None:
            self.current.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "script" and self.current is not None:
            code = "".join(self.current)
            if code.strip():
                self.scripts.append(code)
            self.current = None

html = Path("Apna_Basket.html").read_text(encoding="utf-8")
parser = ScriptExtractor()
parser.feed(html)
if not parser.scripts:
    raise SystemExit("FAIL: no inline JavaScript blocks found")
for index, code in enumerate(parser.scripts, 1):
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
        handle.write(code)
        filename = handle.name
    result = subprocess.run(["node", "--check", filename], text=True, capture_output=True)
    Path(filename).unlink(missing_ok=True)
    if result.returncode:
        print(f"FAIL: inline script #{index}")
        print(result.stderr)
        raise SystemExit(result.returncode)
    print(f"PASS: inline script #{index}")
print(f"PASS: {len(parser.scripts)} inline JavaScript blocks parsed successfully")
