/**
 * Mermaid Loader for MkDocs Material
 *
 * This script handles the loading and rendering of Mermaid diagrams in MkDocs Material.
 * It's designed to work with the instant loading feature and handle various edge cases
 * like hash navigation, palette changes, and failed renders.
 *
 * Features:
 * - Asynchronous loading of mermaid.js
 * - Compatible with MkDocs Material's instant loading
 * - Handles hash navigation and URL changes
 * - Auto-reloads on rendering failures
 * - User-triggered rendering on interaction
 * - Theme consistency with "base" theme
 * - Support for <pre class="mermaid"><code> format
 */

// Handle palette switchers if they exist
const paletteSwitcher1 = document.getElementById("__palette_1");
const paletteSwitcher2 = document.getElementById("__palette_2");

if (paletteSwitcher1) {
  paletteSwitcher1.addEventListener("change", function () {
    location.reload();
  });
}

if (paletteSwitcher2) {
  paletteSwitcher2.addEventListener("change", function () {
    location.reload();
  });
}

// Function to load JavaScript dynamically with Promise support
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = url.endsWith(".mjs") ? "module" : "text/javascript";
    script.src = url;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Error loading script: ${url}`));
    document.head.appendChild(script);
  });
}

// Tracking variables
let renderFailures = 0;
const MAX_RENDER_FAILURES = 2;
let userInteractionTriggered = false;
let navigationCount = 0;
let currentHash = window.location.hash;
let renderPending = false;
let lastRenderTime = 0;

/**
 * Clean up mermaid diagrams by extracting just the diagram code
 * This removes any HTML elements that might interfere with rendering
 */
function cleanupMermaidDiagrams() {
  // Select pre elements with class "mermaid"
  document.querySelectorAll("pre.mermaid2").forEach((el) => {
    // Extract code from the code element inside
    const codeElements = el.querySelectorAll("code");
    if (codeElements.length > 0) {
      const diagramCode = codeElements[0].textContent;
      // Replace the content with just the diagram code text
      el.innerHTML = diagramCode;

      // Make sure the element has the class needed for mermaid processing
      if (!el.classList.contains("mermaid")) {
        el.classList.add("mermaid");
      }
    }
  });
}

/**
 * Initialize and render mermaid diagrams
 * @returns {Promise} A promise that resolves when rendering completes or rejects on error
 */
function initializeMermaid() {
  if (typeof mermaid === "undefined") {
    console.warn("Mermaid library not loaded. Charts will not render.");
    return Promise.reject("Mermaid not loaded");
  }

  try {
    console.log("Initializing mermaid diagrams");

    // Configure mermaid with appropriate settings
    mermaid.initialize({
      theme: "base",
      startOnLoad: false,
      securityLevel: "loose",
      gitGraph: {
        useMaxWidth: true,
      },
    });

    // Clean up diagrams before rendering
    cleanupMermaidDiagrams();

    // Rate limit rendering to prevent excessive calls
    const now = Date.now();
    if (now - lastRenderTime < 500 && renderPending) {
      console.log("Skipping render - too soon after last render");
      return Promise.resolve(); // Skip if we've rendered recently
    }

    renderPending = true;
    lastRenderTime = now;

    // Use Promise-based approach
    return mermaid
      .run({
        querySelector: ".mermaid2", // Updated selector to match pre.mermaid elements
        theme: "base",
      })
      .then(() => {
        // Reset failure counter on success
        renderFailures = 0;
        console.log("Mermaid diagrams rendered successfully!");
        renderPending = false;
      })
      .catch((error) => {
        console.error("Error rendering mermaid diagrams:", error);
        renderPending = false;
        renderFailures++;

        // Reload if we've had multiple failures and it wasn't triggered by user interaction
        if (renderFailures >= MAX_RENDER_FAILURES && !userInteractionTriggered) {
          console.warn("Multiple mermaid rendering failures, reloading page...");
          location.reload();
        }
        userInteractionTriggered = false;
        throw error;
      });
  } catch (error) {
    console.error("Error initializing mermaid:", error);
    renderPending = false;

    // Critical error, reload the page if not triggered by user interaction
    if (!userInteractionTriggered) {
      setTimeout(() => location.reload(), 1000);
    }
    userInteractionTriggered = false;
    return Promise.reject(error);
  }
}

/**
 * Load mermaid library if not already loaded
 */
async function loadMermaid() {
  if (typeof mermaid !== "undefined") {
    // Mermaid is already loaded
    return initializeMermaid();
  }

  let loadAttempts = 0;
  const MAX_LOAD_ATTEMPTS = 2;

  // Skip the ESM version due to chunk loading issues
  try {
    console.log("Loading mermaid script...");
    await loadScript("/scripts/mermaid.min.js");
    console.log("Standard Mermaid loaded successfully");

    // Short delay to ensure script is fully initialized
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeMermaid().then(resolve).catch(resolve);
      }, 100);
    });
  } catch (error) {
    console.error("Failed to load Mermaid library:", error);
    loadAttempts++;

    if (loadAttempts >= MAX_LOAD_ATTEMPTS && !userInteractionTriggered) {
      console.warn("Failed to load Mermaid after multiple attempts, reloading page...");
      location.reload();
    }
    userInteractionTriggered = false;
    throw error;
  }
}

/**
 * Handle user click events to trigger mermaid rendering
 */
function handleUserInteraction() {
  // Only try if mermaid diagrams exist on the page
  if (document.querySelectorAll("pre.mermaid2").length > 0) {
    console.log("User interaction detected, checking mermaid diagrams");
    userInteractionTriggered = true;

    // If mermaid is already loaded, try rendering again
    if (typeof mermaid !== "undefined") {
      initializeMermaid();
    } else {
      // If mermaid isn't loaded yet, try loading it
      loadMermaid();
    }
  }
}

/**
 * Handle hash changes in the URL that might require re-rendering diagrams
 */
function handleHashChange() {
  const newHash = window.location.hash;
  if (newHash !== currentHash) {
    console.log(`Hash changed from ${currentHash} to ${newHash}, checking diagrams`);
    currentHash = newHash;

    // Small delay to allow DOM to update
    setTimeout(() => {
      if (document.querySelectorAll("pre.mermaid2").length > 0) {
        if (typeof mermaid !== "undefined") {
          initializeMermaid();
        } else {
          loadMermaid();
        }
      }
    }, 200);
  }
}

// Self-executing async function for immediate execution
(async function () {
  // Listen for user clicks to render mermaid diagrams
  document.addEventListener("click", handleUserInteraction);

  // Listen for hash changes in URL
  window.addEventListener("hashchange", handleHashChange);

  // Support for mkdocs-material's instant loading feature
  document.addEventListener("DOMContentSwitch", function () {
    navigationCount++;
    console.log(`Content switched (navigation #${navigationCount}), re-rendering mermaid diagrams`);

    // Update the current hash
    currentHash = window.location.hash;

    // For the first navigation, add a slightly longer delay to ensure everything is ready
    const delayTime = navigationCount === 1 ? 300 : 150;

    setTimeout(() => {
      if (document.querySelectorAll("pre.mermaid2").length === 0) {
        console.log("No mermaid diagrams found on page");
        return;
      }

      if (typeof mermaid !== "undefined") {
        // Clean up elements before re-rendering
        cleanupMermaidDiagrams();

        // Force a re-initialization on first navigation to handle any setup issues
        if (navigationCount === 1) {
          mermaid.initialize({
            theme: "base",
            startOnLoad: false,
            securityLevel: "loose",
            gitGraph: {
              useMaxWidth: true,
            },
          });
        }

        mermaid
          .run({
            querySelector: ".mermaid2",
            theme: "base",
          })
          .then(() => {
            renderFailures = 0;
            console.log(`Navigation #${navigationCount}: Mermaid diagrams re-rendered successfully!`);
          })
          .catch((error) => {
            console.error(`Navigation #${navigationCount}: Error re-rendering mermaid diagrams:`, error);
            renderFailures++;

            // After content switch, be more aggressive with reloading on failures
            // Always reload on first navigation failures
            if ((renderFailures >= 1 && navigationCount === 1) || (renderFailures >= 2 && !userInteractionTriggered)) {
              console.warn(`Navigation #${navigationCount}: Failed to render, reloading page...`);
              location.reload();
            }
            userInteractionTriggered = false;
          });
      } else {
        // Try to load mermaid if it's not available after a content switch
        loadMermaid();
      }
    }, delayTime);
  });

  // MutationObserver to detect changes to the DOM that might contain new diagrams
  const observer = new MutationObserver((mutations) => {
    // Check if any mutations added new mermaid diagrams
    let hasMermaidChanges = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            if (
              (node.tagName === "PRE" && node.classList?.contains("mermaid2")) ||
              node.querySelector?.("pre.mermaid2")
            ) {
              hasMermaidChanges = true;
            }
          }
        });
      }
    });

    if (hasMermaidChanges && typeof mermaid !== "undefined") {
      // Debounce the re-render to avoid multiple rapid fires
      clearTimeout(window.mermaidRenderTimeout);
      window.mermaidRenderTimeout = setTimeout(() => {
        console.log("DOM changes detected with mermaid diagrams, re-rendering");
        initializeMermaid();
      }, 300);
    }
  });

  // Observe the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Load mermaid as soon as possible
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadMermaid);
  } else {
    // DOM already loaded, load mermaid right away
    loadMermaid();
  }
})();
