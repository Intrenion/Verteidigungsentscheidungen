(function () {
  // Only enable comments on /decisions/ pages
  function shouldLoadComments() {
    return location.pathname.startsWith("/decisions/");
  }

  function loadHyvor(pageId) {
    // Prevent double loading
    if (window.__hyvorLoaded) return;
    window.__hyvorLoaded = true;

    const mount = document.getElementById("comments");
    if (!mount) return;

    // Load Hyvor embed script
    const s = document.createElement("script");
    s.src = "https://talk.hyvor.com/embed/embed.js";
    s.type = "module";
    s.async = true;
    document.head.appendChild(s);

    // Create Hyvor widget
    const el = document.createElement("hyvor-talk-comments");
    el.setAttribute("website-id", "YOUR_WEBSITE_ID");
    el.setAttribute("page-id", pageId);

    mount.appendChild(el);
  }

  // Footer is injected asynchronously, so wait until #comments exists
  function waitForMount(tries = 60) {
    const mount = document.getElementById("comments");
    if (mount) return Promise.resolve(true);
    if (tries <= 0) return Promise.resolve(false);

    return new Promise((resolve) =>
      setTimeout(() => resolve(waitForMount(tries - 1)), 50)
    );
  }

  (async function init() {
    // Only run on decisions pages
    if (!shouldLoadComments()) return;

    // Wait until footer injection is complete
    const ok = await waitForMount();
    if (!ok) return;

    // Use URL path as unique page ID
    const pageId = location.pathname.replace(/\/$/, "");

    loadHyvor(pageId);
  })();
})();
