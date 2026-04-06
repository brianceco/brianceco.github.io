window.MathJax = {
  tex: {
    tags: "ams",
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    packages: { "[+]": ["mathtools", "mathrsfs"] },
    macros: {
      RR: "\\mathbf{R}",
      NN: "\\mathbf{N}",
      ZZ: "\\mathbf{Z}",
      QQ: "\\mathbf{Q}",
      CC: "\\mathbf{C}",
      E: "\\mathbf{E}",
      euscr: ["\\mathscr{#1}", 1],
      bm: ["\\boldsymbol{#1}", 1],
      lb: "\\lbrace",
      rb: "\\rbrace",
      coloneqq: "\\mathrel{:=}",
      eqqcolon: "\\mathrel{=:}",
      colon: "\\mathrel{:}",
    },
  },
  options: {
    renderActions: {
      addCss: [
        200,
        function (doc) {
          const style = document.createElement("style");
          style.innerHTML = `
          /* Unnumbered display equations (align*, $$...$$, etc.) shrink-wrap
             their content, so overflow-x on the container itself works. */
          mjx-container[jax="CHTML"][display="true"] {
            overflow-x: auto !important;
            overflow-y: hidden !important;
            max-width: 100% !important;
            padding-bottom: 0.25rem;
          }
          .mjx-container {
            color: inherit;
            max-width: 100%;
          }
          /* Numbered equations (align, equation) are rendered by MathJax as a
             full-width block containing an mjx-mtable, so the overflow lives
             on the inner table, not the container. We wrap them in a scroll
             wrapper at typeset time (see "wrapScroll" renderAction below). */
          .mjx-scroll-wrapper {
            overflow-x: auto;
            overflow-y: hidden;
            max-width: 100%;
            padding-bottom: 0.25rem;
          }
        `;
          document.head.appendChild(style);
        },
        "",
      ],
      wrapScroll: [
        200,
        function (doc) {
          for (const math of doc.math) {
            const node = math.typesetRoot;
            if (!node || node.dataset.scrollWrapped) continue;
            if (node.getAttribute("display") !== "true") continue;
            // Only wrap numbered equations: they contain an mjx-mlabeledtr.
            if (!node.querySelector("mjx-mlabeledtr")) continue;
            const wrapper = document.createElement("div");
            wrapper.className = "mjx-scroll-wrapper";
            node.parentNode.insertBefore(wrapper, node);
            wrapper.appendChild(node);
            node.dataset.scrollWrapped = "1";
          }
        },
        "",
      ],
    },
  },
};
