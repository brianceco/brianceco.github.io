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
        `;
          document.head.appendChild(style);
        },
        "",
      ],
    },
  },
};
