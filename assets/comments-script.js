(function () {
  function shouldLoadComments() {
    return location.pathname.startsWith("/decisions/");
  }

  function waitForContainer(tries = 200) {
    if (document.getElementById("comments-container")) return Promise.resolve(true);
    if (tries <= 0) return Promise.resolve(false);

    return new Promise((resolve) =>
      setTimeout(() => resolve(waitForContainer(tries - 1)), 50)
    );
  }

  function loadHyvor(pageId) {
    if (window.__hyvorLoaded) return;
    window.__hyvorLoaded = true;

    const container = document.getElementById("comments-container");
    if (!container) return;

    // Create mount inside the footer slot
    const mount = document.createElement("div");
    mount.id = "comments";
    container.appendChild(mount);

    // Load Hyvor embed script
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

  (async function init() {
    if (!shouldLoadComments()) return;

    const ok = await waitForContainer();
    if (!ok) return;

    const pageId = location.pathname.replace(/\/$/, "");
    loadHyvor(pageId);
  })();
})();
