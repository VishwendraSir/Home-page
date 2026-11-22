/* Science Centre Learning Hub — Facebook follow shortcut */
(function () {
  if (document.getElementById("sch-facebook-follow")) return;
  const link = document.createElement("a");
  link.id = "sch-facebook-follow";
  link.href = "https://www.facebook.com/share/1CHHjYQtqe/";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "Follow Science Centre Learning Hub on Facebook");
  link.innerHTML = '<span aria-hidden="true" class="sch-fb-icon">f</span><span class="sch-fb-label">Follow on Facebook</span>';
  const style = document.createElement("style");
  style.textContent = `
    #sch-facebook-follow{position:fixed;right:16px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:9px;padding:10px 15px;border-radius:999px;background:#1877f2;color:#fff;text-decoration:none;font:600 14px/1.2 Arial,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.24);transition:transform .18s ease,box-shadow .18s ease}
    #sch-facebook-follow:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.28)}
    #sch-facebook-follow:focus-visible{outline:3px solid #111;outline-offset:3px}
    #sch-facebook-follow .sch-fb-icon{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#fff;color:#1877f2;font:bold 20px/1 Arial,sans-serif}
    @media(max-width:480px){#sch-facebook-follow{right:10px;bottom:12px;padding:9px 12px;font-size:12px}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(link);
})();