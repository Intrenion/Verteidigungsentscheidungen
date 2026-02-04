(function () {

  function shouldLoadComments() {
    return location.pathname.startsWith("/decisions/");
  }

  function waitForContainer(tries = 200) {
    if (document.getElementById("comments-container")) {
      return Promise.resolve(true);
    }

    if (tries <= 0) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) =>
      setTimeout(() => resolve(waitForContainer(tries - 1)), 50)
    );
  }

  /*
    This is the important fix:

    We always derive the HyvorTalk thread ID from the canonical URL,
    not from the current browser URL.

    That means:

      /decisions/foo
      /decisions/foo.html

    will BOTH map to the SAME comment thread.
  */
  function getCanonicalPathId() {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    if (!canonical) return null;

    const u = new URL(canonical);

    // Path like: /decisions/foo.html or /decisions/foo/
    let path = u.pathname;

    // Remove ".html" if present
    path = path.replace(/\.html$/, "");

    // Remove trailing slash (except homepage "/")
    if (path.length > 1) {
      path = path.replace(/\/$/, "");
    }

    return path;
  }

  function loadHyvor(pageId) {
    if (window.__hyvorLoaded) return;
    window.__hyvorLoaded = true;

    const container = document.getElementById("comments-container");
    if (!container) return;

    // Divider above comments
    const topHr = document.createElement("hr");
    container.appendChild(topHr);

    // Spacing
    const br = document.createElement("br");
    container.appendChild(br);

    // Mount point
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

    // This is the stable ID
    el.setAttribute("page-id", pageId);

    mount.appendChild(el);
  }

  (async function init() {
    if (!shouldLoadComments()) return;

    const ok = await waitForContainer();
    if (!ok) return;

    // Use canonical URL if available
    const canonicalId = getCanonicalPathId();

    // Fallback: normalize current path
    const fallbackId = location.pathname
      .replace(/\.html$/, "")
      .replace(/\/$/, "");

    const pageId = canonicalId || fallbackId;

    loadHyvor(pageId);
  })();

})();
