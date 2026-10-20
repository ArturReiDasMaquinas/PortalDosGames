/* ==========================================================================
   Portal dos Games — runtime
   - carrega site-config.json e preenche tudo que tem data-config
   - menu mobile
   - "atalho" (atalho para o site do TH06-web) via ?jogo=th06
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- utils */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return (acc && Object.prototype.hasOwnProperty.call(acc, key)) ? acc[key] : undefined;
    }, obj);
  }

  /* Editar JSON no Bloco de Notas / VS Code no Windows pode gravar um BOM
     UTF-8. Response.json() não aceita BOM, então o site-config.json inteiro
     deixaria de ser lido. Tiramos o BOM antes do parse. */
  function parseJson(text) {
    if (text && text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    return JSON.parse(text);
  }

  var toastTimer = null;
  function toast(msg, isError) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("toast--error", !!isError);
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 3200);
  }

  /* --------------------------------------------------------------- config */

  var CONFIG = {
    siteName: "Portal dos Games",
    tagline: "Jogos que merecem rodar no navegador",
    author: "Artur Barbosa",
    links: {
      th06: {
        label: "Touhou 6 — Embodiment of Scarlet Devil",
        description: "Reimplementação em Rust/WebAssembly. Roda direto no navegador, 60 fps.",
        url: "#",
        icon: "🌸",
        tag: "WASM",
        primary: true
      },
      flash: {
        label: "Site de jogos Flash",
        description: "O portal antigo, com os jogos em Flash/HTML5.",
        url: "#",
        icon: "⚡",
        tag: "Flash",
        primary: false
      }
    },
    social: { github: "#" }
  };

  function applyConfig(cfg) {
    /* Qualquer elemento com data-config="caminho.chave" recebe o valor.
       data-config-attr="href" define em qual atributo ele vai.            */
    $$("[data-config]").forEach(function (el) {
      var path = el.getAttribute("data-config");
      var val = getPath(cfg, path);
      if (val === undefined || val === null || val === "") return;

      var attr = el.getAttribute("data-config-attr") || "text";
      if (attr === "text") {
        el.textContent = val;
      } else {
        el.setAttribute(attr, val);
      }
    });

    /* Links que apontam para fora: abre em nova aba e ganha rel seguro. */
    $$("[data-config][data-config-attr='href']").forEach(function (el) {
      var href = el.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  function loadConfig() {
    if (!window.fetch) { applyConfig(CONFIG); return Promise.resolve(); }
    return fetch("site-config.json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (txt) {
        CONFIG = parseJson(txt);
        applyConfig(CONFIG);
      })
      .catch(function () {
        /* site-config.json ausente ou inválido: mantém os defaults do HTML. */
        applyConfig(CONFIG);
      });
  }

  /* ---------------------------------------------------------- menu mobile */

  function initMenu() {
    var toggle = $("#navToggle");
    var nav = $("#nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------- atalho / deep link
     /jogos.html?jogo=th06  ->  abre direto o site do TH06-web
     Vários sites "atalho" no GitHub Pages pointing at the same repo with
     different query strings.                                              */

  function initShortcut() {
    var params = new URLSearchParams(window.location.search);
    var jogo = params.get("jogo");
    if (!jogo) return;

    var link = getPath(CONFIG, "links." + jogo + ".url");
    if (!link || link === "#") {
      toast("Atalho '" + jogo + "' não configurado em site-config.json", true);
      return;
    }
    toast("Abrindo " + jogo + "…");
    window.location.href = link;
  }

  /* --------------------------------------------------------- ano no rodapé */

  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------------- init */

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initYear();
    loadConfig().then(initShortcut);
  });

  window.Portal = { toast: toast, config: function () { return CONFIG; } };
})();
