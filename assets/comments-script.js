(function () {
  function shouldLoadComments() {
    return location.pathname.startsWith("/decisions/");
  }

  function ensureMountExists() {
    // If the mount already exists, do nothing
    if (document.getElementById("comments")) return true;

    // Try to place it inside the injected footer, if present
    const footer = document.querySelector(".site-footer");
    if (!footer) return false;

    // Create mount container
    const mount = document.createElement("div");
    mount.id = "comments";

    // Insert it near the top of the footer
    footer.insertBefore(mount, footer.firstChild);

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

  function waitForFooter(tries = 200) {
    if (document.querySelector(".site-footer")) return Promise.resolve(true);
    if (tries <= 0) return Promise.resolve(false);

    return new Promise((resolve) =>
      setTimeout(() => resolve(waitForFooter(tries - 1)), 50)
    );
  }

  (async function init() {
    // Only load comments on decisions pages
    if (!shouldLoadComments()) return;

    // Wait until the footer has been injected
    const ok = await waitForFooter();
    if (!ok) return;

    // Ensure the mount point exists inside the footer
    if (!ensureMountExists()) return;

    // Use the pathname as page-id (stable, no trailing slash)
    const pageId = location.pathname.replace(/\/$/, "");

    loadHyvor(pageId);
  })();
})();
