/* Science Centre Learning Hub social shortcuts for Chemistry quiz */
(function () {
  if (document.getElementById("sch-social-links")) return;
  const wrap = document.createElement("div");
  wrap.id = "sch-social-links";
  wrap.innerHTML = `
    <a class="sch-social sch-whatsapp" href="https://whatsapp.com/channel/0029Vb4HINJ96H4LDSR4uV0q" target="_blank" rel="noopener noreferrer" aria-label="Join WhatsApp Channel"><span>☏</span> WhatsApp Channel</a>
    <a class="sch-social sch-facebook" href="https://www.facebook.com/ScienceCentreGuruj" target="_blank" rel="noopener noreferrer" aria-label="Follow Facebook Page"><span>f</span> Facebook Page</a>
  `;
  const style = document.createElement("style");
  style.textContent = `
    #sch-social-links{position:fixed;right:12px;bottom:14px;z-index:2147483000;display:flex;flex-direction:column;gap:8px;align-items:flex-end}
    #sch-social-links .sch-social{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;color:#fff;text-decoration:none;font:700 13px/1.2 Arial,sans-serif;box-shadow:0 4px 15px #0004;transition:transform .18s ease}
    #sch-social-links .sch-social:hover{transform:translateY(-2px)}
    #sch-social-links .sch-social span{display:grid;place-items:center;width:21px;height:21px;border-radius:50%;background:#fff;font:bold 16px/1 Arial,sans-serif}
    #sch-social-links .sch-whatsapp{background:#128c7e}
    #sch-social-links .sch-whatsapp span{color:#128c7e}
    #sch-social-links .sch-facebook{background:#1877f2}
    #sch-social-links .sch-facebook span{color:#1877f2}
    @media(max-width:480px){#sch-social-links{right:8px;bottom:9px;gap:6px}#sch-social-links .sch-social{font-size:11px;padding:8px 11px}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(wrap);
})();