/* Science Centre Learning Hub — WhatsApp Channel shortcut */
(function () {
  if (document.getElementById("sch-whatsapp-follow")) return;
  const link = document.createElement("a");
  link.id = "sch-whatsapp-follow";
  link.href = "https://whatsapp.com/channel/0029Vb4HINJ96H4LDSR4uV0q";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "Join Science Centre Learning Hub on WhatsApp");
  link.innerHTML = '<span aria-hidden="true" class="sch-wa-icon">☏</span><span class="sch-wa-label">Join WhatsApp Channel</span>';
  const style = document.createElement("style");
  style.textContent = `
    #sch-whatsapp-follow{position:fixed;left:16px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:9px;padding:10px 15px;border-radius:999px;background:#128c7e;color:#fff;text-decoration:none;font:600 14px/1.2 Arial,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.24);transition:transform .18s ease,box-shadow .18s ease}
    #sch-whatsapp-follow:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.28)}
    #sch-whatsapp-follow:focus-visible{outline:3px solid #111;outline-offset:3px}
    #sch-whatsapp-follow .sch-wa-icon{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#fff;color:#128c7e;font:bold 20px/1 Arial,sans-serif}
    @media(max-width:480px){#sch-whatsapp-follow{left:10px;bottom:12px;padding:9px 12px;font-size:12px}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(link);
})();