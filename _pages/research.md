---
layout: page
permalink: /research/
title: research
nav: true
nav_order: 2
hide_title: true
_styles: >
  .project-years, .paper-meta { color: var(--global-theme-color); margin-bottom: 0.25rem; }
  .paper-meta .sep { color: var(--global-text-color); }
---

<header class="post-header">
  <h1 class="post-title">papers</h1>
</header>

<div class="papers-list">
<ol>
  <li>
    <h4><a href="https://arxiv.org/abs/2609.27113">Active Portfolio Management in Concentrated Equity Markets</a></h4>
    <p class="paper-meta"><small>Brian Ceco, Xiaofei Shi, Ting-Kam Leonard Wong <span class="sep">|</span> 2026 <span class="sep">|</span> Preprint</small></p>
    <details>
      <summary>Abstract</summary>
      <p>
         The equal-weighted portfolio is a passive, rule-based strategy that has historically been difficult to outperform, delivering higher returns than the capitalization-weighted “market” benchmark across many markets and periods. Stochastic portfolio theory (SPT) reveals that this relative performance is regime dependent, with the equal-weighted portfolio underperforming during periods of increasing market concentration and high correlations, particularly market bubbles. These observations have motivated us to formulate and solve a stochastic control problem in which an investor actively allocates between the equal-weighted and market portfolios. The investor bases their allocation decisions on forecasts made under a flexible stochastic diversity–dispersion (SDD) model. Using a quadratic surrogate for implementation frictions, we characterize the optimal allocation through a linear forward–backward SDE and obtain an explicit “aiming in front of a moving target” representation of the optimal trading rate, in the spirit of Gârleanu and Pedersen. The penalty parameters are calibrated in sample to match the cumulative wealth effect of proportional transaction costs, while out-of-sample performance is evaluated with those costs deducted directly from portfolio wealth. Using historical S&P 500 data, we show that a mean-reverting SDD specification reproduces several empirical features of market diversity and dispersion. In out-of-sample backtests from 1995 to 2024, the resulting strategies deliver higher cumulative net returns than both the equal-weighted and market portfolios, and higher information ratios than the equal-weighted portfolio after 15-basis-point proportional transaction costs 
      </p>
    </details>
  </li>
</ol>
</div>

<header class="post-header">
  <h1 class="post-title">other projects</h1>
</header>

<div class="projects-list">
<ol>
  <li>
    <h4><a href="{{ '/assets/pdf/4246_report.pdf' | relative_url }}">Active and Passive Portfolio Management with Latent Factors</a></h4>
    <p class="project-years"><small>2025</small></p>
    <p>
       My final project for Professor Leonard Wong’s ’25 Winter course, Research Problems in Mathematical Finance (STA4246). I give an expository overview of Ali Al-Aradi and Sebastian Jaimungal’s <a href="https://www.tandfonline.com/doi/full/10.1080/14697688.2021.1881598#d1e9840">paper</a>.
    </p>
  </li>
  <li>
    <h4><a href="{{ '/assets/pdf/msc_thesis.pdf' | relative_url }}">Computing Homotopy Groups of Madsen-Tillmann Spectra</a></h4>
    <p class="project-years"><small>2023</small></p>
    <p>
       My master’s thesis, in which I used the Adams spectral sequence to compute the 2-primary stable homotopy groups of the (plus construction of the) classifying space of the stable non-orientable mapping class group up to degree 15.
    </p>
  </li>
</ol>
</div>
