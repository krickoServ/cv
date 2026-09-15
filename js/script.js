// ==========================================================================
// Christoffer Landberg — IT-portfolio
// JavaScript
// ==========================================================================

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Lucide-ikoner ----------
  if (window.lucide) {
    lucide.createIcons();
  }

  // ---------- Mobilmeny ----------
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Stäng menyn automatiskt när en länk klickas (mobil)
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Scroll-reveal ----------
  if ("IntersectionObserver" in window && !reduceMotion) {
    document.body.classList.add("js-ready");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  }

  // ---------- GitHub-repos ----------
  // Hämtar riktiga repos från GitHubs publika API, så innehållet i
  // GitHub-sektionen alltid speglar det som faktiskt finns på kontot —
  // ingen risk att texten här hamnar fel eller blir inaktuell.
  var GITHUB_USERNAME = "krickoServ";
  var reposContainer = document.getElementById("github-repos");

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderRepos(repos) {
    if (!repos.length) {
      reposContainer.innerHTML = '<p class="github-status">Inga publika repos hittades just nu.</p>';
      return;
    }

    reposContainer.innerHTML = repos
      .map(function (repo) {
        var description = repo.description ? escapeHtml(repo.description) : "Ingen beskrivning tillagd.";
        var language = repo.language ? '<li>' + escapeHtml(repo.language) + '</li>' : "";
        return (
          '<div class="card project-card">' +
            '<div class="card-head"><div class="card-title">' + escapeHtml(repo.name) + '</div></div>' +
            '<p>' + description + '</p>' +
            '<ul class="tag-list">' + language + '</ul>' +
          '</div>'
        );
      })
      .join("");
  }

  if (reposContainer) {
    fetch("https://api.github.com/users/" + GITHUB_USERNAME + "/repos?sort=updated&per_page=6")
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub svarade " + res.status);
        return res.json();
      })
      .then(renderRepos)
      .catch(function () {
        reposContainer.innerHTML =
          '<p class="github-status">Kunde inte hämta repos just nu. Se länken nedan istället.</p>';
      });
  }
})();
