(function () {
  function shouldLoadComments() {
    return location.pathname.startsWith("/decisions/");
  }

  function ensureMountExists() {
    // Use the dedicated slot inside the footer
    const slot = document.getElementById("comments-container");
    if (!slot) return false;

    // Create mount only once
    let mount = document.getElementById("comments");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "comments";
      slot.appendChild(mount);
    }

    return true;
  }

  function loadHyvor(pageId) {
    if (window.__hyvorLoaded) return;
    window.__hyvorLoaded = true;

    const mount = document.getElementById("comments");
    if (!mount) return;

    // Load Hyvor embed script once
    const s = document.createElement("script");
    s.src = "https://talk.hyvor.com/embed/embed.js";
    s.type = "module";
    s.async = true;
    document.head.appendChild(s);

    // Create Hyvor comments element
    const el = document.createElement("hyvor-talk-comments");
    el.setAttribute("website-id", "14958");
    el.setAttribute("page-id", pageId);

    mount.appendChild(el);
  }

  function waitForSlot(tries = 200) {
    if (document.getElementById("comments-container")) return Promise.resolve(true);
    if (tries <= 0) return Promise.resolve(false);

    return new Promise((resolve) =>
      setTimeout(() => resolve(waitForSlot(tries - 1)), 50)
    );
  }

  (async function init() {
    if (!shouldLoadComments()) return;

    const ok = await waitForSlot();
    if (!ok) return;

    if (!ensureMountExists()) return;

    const pageId = location.pathname.replace(/\/$/, "");
    loadHyvor(pageId);
  })();
})();
