// progress.js: Progress bar and localStorage persistence
(function () {
  "use strict";

  // Page order for progress tracking
  var pages = ["index.html", "tools.html", "tools-and-prep.html", "step-by-step.html"];

  function getCurrentStep() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    return pages.indexOf(path);
  }

  function updateProgressBar() {
    var bar = document.getElementById("progress-bar");
    if (!bar) return;
    var current = getCurrentStep();
    var steps = bar.querySelectorAll(".step");
    steps.forEach(function (step, i) {
      step.classList.remove("active", "completed");
      if (i < current) step.classList.add("completed");
      else if (i === current) step.classList.add("active");
    });
  }

  // Save visited pages to localStorage
  function markVisited() {
    var current = getCurrentStep();
    var visited = JSON.parse(localStorage.getItem("frontier-oil-visited") || "[]");
    if (!visited.includes(current)) {
      visited.push(current);
      visited.sort(function (a, b) { return a - b; });
      localStorage.setItem("frontier-oil-visited", JSON.stringify(visited));
    }
  }

  // Restore visited state on load
  function restoreVisited() {
    var visited = JSON.parse(localStorage.getItem("frontier-oil-visited") || "[]");
    var bar = document.getElementById("progress-bar");
    if (!bar) return;
    var steps = bar.querySelectorAll(".step");
    visited.forEach(function (i) {
      if (i < steps.length && i < getCurrentStep()) {
        steps[i].classList.add("completed");
      }
    });
  }

  // Add click handlers to nav links to pre-mark next page
  function enhanceNav() {
    var navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        var href = link.getAttribute("href");
        var nextStep = pages.indexOf(href);
        if (nextStep > getCurrentStep()) {
          var visited = JSON.parse(localStorage.getItem("frontier-oil-visited") || "[]");
          if (!visited.includes(nextStep)) {
            visited.push(nextStep);
            visited.sort(function (a, b) { return a - b; });
            localStorage.setItem("frontier-oil-visited", JSON.stringify(visited));
          }
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      updateProgressBar();
      restoreVisited();
      markVisited();
      enhanceNav();
    });
  } else {
    updateProgressBar();
    restoreVisited();
    markVisited();
    enhanceNav();
  }
})();