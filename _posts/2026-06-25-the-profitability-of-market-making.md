---
layout: post
title: The Profitability of Market Making
date: 2026-06-25
description: 
tags: market_making, market_impact 
toc:
  beginning: true
---

<a href="https://github.com/brianceco/profitability-of-market-making" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> brianceco/profitability-of-market-making</a>

<div class="text-center">
{% include figure.liquid 
   path="/assets/img/blogs/2026/profitability-of-market-making/mid-price.png"
   caption="Figure 1: Mid-price of TSLA after arrival of each market order between 01/01/2025 and 03/31/2025."
   class="img-fluid rounded z-depth-1"
%}
</div>

This blog post is an attempt to explore the following question: 

*How do market makers trade, and how does this trading influence market microstructure?*

Of course, the scope of this question is very large--it is at the heart of over 50 years of market microstructure research. In place of a comprehensive answer, we will content ourselves with a toy model which gives us a flavour of the strategic decision making process market makers undergo to optimize their trading. 

These ideas are taken from chapters 11 and 15 of Bouchaud, Bonart, Donier, and Gould's wonderful book, "Trades, Quotes, Prices" {% cite BBDG18 --file profitability-of-market-making.bib %}. Along the way, we use trades-and-quotes (TAQ) equity data available from [Lobster](https://lobsterdata.com/book-sample) with the purchase of the book to assess our model.

We assume for simplicity we are considering equity markets throughout the post, but there is nothing inherent in the theory which necessitates this (whether the modelling choices are reasonable for other asset classes is another question).

# 1. Let's hope our markets are inefficient
The first thing to observe is that if markets are "efficient", we shouldn't expect "market making" to be profitable. By "efficient markets", we mean in a **weak sense** that the *traded* price $$p_t$$ of an asset over (trade) time is a martingale, i.e., 

$$
\E[p_{t+h} \mid \mathcal{I}_t] = p_t
$$

for all $$h>0$$. That is, our best forecast for the expected price at some future time, given all information $$\mathcal{I}_t$$ available to us at the present time $$t$$, is simply the current price, $$p_t$$. A stronger version of the efficient market hypothesis (EMH) would claim not only are prices martingales, but that current prices reflect some underlying fair/fundamental value. In the case of equities, this fundamental value would be something like the expected discounted present value of future cash flows of the company. By "market making", we mean simply posting limit orders at the best quotes on either side of the limit order book (LOB), i.e., buys and sells, and profiting off of the spread. 

We assume for simplicity that market orders are filled at the best quote, i.e., at the bid $$b_t$$ or the ask $$a_t$$, and hence do not walk the book. Moreover, once the market maker has been filled on a trade on either side, they liquidate their position immediately with a market order at the best quote on the opposite side of the book, thereby profiting off the spread.

To see why this simplified market-making strategy cannot be profitable under the weak EMH, let's consider how the price evolves on an order-by-order basis. Given that $$t$$ trades have occurred until now, hence our current price is $$p_t$$, the price will update once a resting limit order is executed against an incoming market order. The market order will have a direction $$\varepsilon_{t+1} \in \{\pm 1\}$$, representing whether the order is to buy (+1), in which case it executes on the ask side of the LOB, or to sell (-1), in which case it executes on the bid side. Let $$\tau _{b}$$ denote the first time after $$t$$ a market order executes against a bid, and similarly let $$\tau _a$$ be the first time a market order executes against an ask. These are stopping times, and we can define them easily enough, e.g., 

$$\tau _b = \inf\{s>t: \varepsilon_{s}=-1\}$$ 

and similarly for $$\tau _a$$. Notice that $$t+1 \in \{\tau _{a}, \tau _b\} $$ almost surely, i.e., the next trade will either be a buy or a sell, and that $$\tau _b \neq \tau _a$$, i.e., each market order has a unique sign. Let $$b_{\mathrm{next}}\coloneqq b_{\tau _b}$$ denote the bid price when the next sell market order arrives, and similarly define $$a_{\mathrm{next}}=a_{\tau _a}$$. Under the reasonable assumption that $$\tau _a$$ and $$\tau _b$$ are almost surely bounded, by the optional stopping theorem, the martingale property implies 

$$\begin{align*}
        \E[b_{\mathrm{next}}] &=  \E[p_{\tau _b}] = \E[p_{\tau _b} \mid \mathcal{I}_t] = p_{t}\\
        \E[a_{\mathrm{next}}] &=   \E[p_{\tau _a}] = \E[p_{\tau _a} \mid \mathcal{I}_t] = p_{t}
.\end{align*}$$

Here we have used the fact that at (trade) time $$\tau _{b}$$, a sell market order will be filled at the bid price, hence $$p_{\tau _b}=b_{\mathrm{next}}$$, and similarly for the next market sell order. Thus, we see that the expected price at which both the next buy order and the next sell order will be executed at is the current price $$p_t$$. In particular, we have $$b_{\mathrm{next}}=a_{\mathrm{next}}$$, and so we conclude the market maker's expected profit per each round-trip trade is $$\E[a_{\mathrm{next}}-b_{\mathrm{next}}]=0$$.

# 2. Breaking even in an EMH world
In the previous section, we saw that in a world in which asset prices are martingales, market makers cannot hope to make profit from capturing the spread.This prompts an immediate follow-up question, namely, can the market maker even hope to break-even on average? To answer this question, we consider a simplified market model introduced by Albert Kyle in 1985. Kyle's model can be viewed as the progenitor of the field of market microstructure, and although it consists of simplifying assumptions which are known to not hold in practice, it demonstrates how several empirical properties of markets can arise naturally as a consequence of the strategic behaviour of traders.

The simplest version of Kyle's model is set up as follows. We consider a single-period $$t \in \{0,1\} $$ discrete-time market consisting of a single stock with random price $$p_t$$, traded amongst a market maker (MM), an informed trader (IT), and a set of noise traders (NT). Here $$p_1$$ represents the terminal price of the stock regardless of whatever trading takes place between MM, IT, and NT, and moreover, that all market participants can liquidate their holdings at terminal time at price $$p_1$$ without incurring any market impact. The informed traders and noise traders are both price takers, that can only trade the stock at the price set by the market maker. We assume the terminal price follows a Gaussian $$p_1 \sim N(p_0, \sigma^2_p)$$, i.e. in particular, $$p_t$$ is a martingale. The market participants behave as follows: 

1 (IT). At $$t=0$$, the informed trader possesses private information about the terminal price $$p_1$$. Thus, with respect to the informed trader's information set, $$p_1$$ is nonrandom. The informed trader chooses a position $$V_{\mathrm{IT}}=\varepsilon Q$$ to trade consisting of a volume $$Q \geq 0$$ and a sign $$\varepsilon \in \{\pm 1\} $$.

2 (NT). The noise traders do not possess an informational advantage, and instead trade for idiosyncratic reasons (e.g., trading on perceived information which is in fact noise). The noise traders generate a random net volume $$V_{\mathrm{NT}}$$ which is independent of $$p_1$$. 

3 (MM). The market maker seeks to clear the market, matching the net **total order imbalance** $$\Delta V = V_{\mathrm{IT}}+V_{\mathrm{NT}}$$ with their own inventory, at a clearing price $$p_{\mathrm{MM}}$$ that they set.

In the style of classical *Arrow-Debreu economic theory*, we are interested in characterizing a **market-clearing equilibrium** $$(p^{*}_{\mathrm{MM}},V^{*}_{\mathrm{IT}})$$, i.e., a trade $$V^{*}_{\mathrm{IT}}=\varepsilon^{*}Q^{*}$$ by the informed trader and a quote $$p^{*}_{\mathrm{MM}}$$ by the market maker such that, the informed trader maximizes their expected PnL given the clearing price, and the market maker breaks even in expectation. 

In order to make the model tractable, Kyle imposed two following additional conditions in addition to the Gaussian price:

1. (Gaussian noise trading). We assume the net order flow of noise traders follows a Gaussian $$V_{\mathrm{NT}}\sim N(0,\sigma^2_{\mathrm{NT}})$$.

2. (Linear impact). The market maker follows a rules-based strategy for setting the clearing price, using a linear model

   $$
   p_{\mathrm{MM}} = \E[p \mid \Delta V] = p_0 + \Lambda \Delta V
   .$$

   Thus, the market maker aims to filter the informed trader's informational advantage from the net order flow $$\Delta V$$, such that their clearing price is an unbiased estimator of the true price. The regression coefficient $$\Lambda$$ is called **Kyle's lambda**.

Moreover, we assume the informed trader knows how the market maker sets their clearing price, and conversely, we assume the market maker knows the informed trader seeks to maximize their expected PnL. Under this simplified setting, a market equilibrium exists which we can characterize explicitly.

We begin with the informed trader. We know they will trade in the direction $$\varepsilon^{*}=\sgn(\Delta p)$$ of their edge $$\Delta p = p_1-p_0$$. Thus, their objective for profit maximization can be formulated as a quadratic maximization problem 

$$\begin{align*}
        Q^{*} &=   \argmax_{Q} \E[\mathrm{PnL} \mid p_1]\\
              &= V_{\mathrm{IT}}(p_1-\E[p_{\mathrm{MM}} \mid p_1])\\
        &= \sgn(\Delta p) Q(\Delta p - \Lambda \sgn(\Delta p)Q)
\end{align*}$$

where we have used assumption (3) and the fact that $$\E[V_{\mathrm{NT}}]=0$$ in the last line. Thus, the optimal volume to trade is given by 
Q^{*} = \frac{1}{2} \frac{\lvert\Delta p\rvert}{\Lambda}
.$$ 

As the market maker knows the informed trader's position given their informational edge, the market maker will filter $$\Delta p$$ by regressing the informed trader's volume against the net order flow. By assumptions (1) and (2), this satisfies a Gaussian linear model $$V_{\mathrm{IT}}^{*}=\Delta V - V_{\mathrm{NT}}$$, hence we obtain 

$$\begin{align*}
\E[V^{*}_{\mathrm{IT}} \mid \Delta V] &=   \Delta V \frac{\cov(V^{*}_{\mathrm{IT}}, \Delta V)}{\var(\Delta V)}\\
&= \Delta V \frac{\var(V_{\mathrm{IT}}^{*})}{\var(V_{\mathrm{IT}}^{*}) + \var(V_{\mathrm{NT}})}\\
&= \Delta V  \frac{\sigma^2_p}{\sigma^2_p + 4\Lambda \sigma^2_F}
.\end{align*}$$

From this, the optimal clearing price is given by 

$$\begin{align*}
         \E[p_1 \mid \Delta V] &= p_0+ 2\Lambda \E[V_{\mathrm{IT}}^{*} \mid \Delta V]\\
        &=  p_0 + 2 \Lambda \sigma^2_p \frac{\Delta V}{\sigma^2_p + 4\Lambda^2 \sigma^2_{\mathrm{NT}}}
.\end{align*}$$

Combining this with the assumption of linear impact, we can solve explicitly for $$\Lambda$$ to obtain 

$$
\Lambda = \frac{1}{2}\frac{\sigma_p}{\sigma_{\mathrm{NT}}}
.$$

Lets take a moment to outline the major conclusions of Kyle's model:

1. Under Gaussian price, Gaussian noise trading volume, and linear impact, an equilibrium $$(V^{*}_{\mathrm{IT}}, p^{*}_{\mathrm{MM}})$$ between an informed trader and a market maker exists, and moreover is highly interpretable. The optimal position $$V^{*}_{\mathrm{IT}}$$ for the informed trader is directly proportional to their edge $$\Delta p$$, and inversely proportional to the impact coefficient $$\Lambda$$, the latter representative of their trading costs. The market maker's optimal impact coefficient $$\Lambda$$ given by by half the ratio of the informed trader's expected edge $$\sigma_p = \sqrt{\E\lvert\Delta p\rvert^2} \approx \E \lvert\Delta p\rvert $$ to the volatility of noise trading volume. 

2. We see that market impact, measured by $$\Lambda$$, arises as a consequence of the market maker protecting themselves against adverse selection by informed traders. In order to maximize their profit, the informed trader must reduce their trading volume so as to mitigate the market impact they incur. We see that the presence of noise traders increases market liquidity, allowing the market maker to adjust prices less aggressively in response to the informed trader.

3. For typical values of the price deviation $$\lvert\Delta p\rvert \approx \sigma_p$$ and the noise trading volume $$\lvert V_{\mathrm{NT}}\rvert \approx \sigma_{\mathrm{NT}}$$, we see that $$\lvert V_{\mathrm{IT}}\rvert \approx \lvert V_{\mathrm{NT}}\rvert $$, i.e., the informed trader makes up nearly have the total traded volume in the market. In reality, price takers with an informational edge trade a much smaller portion of the total volume, so as to mitigate their impact. This is the basis of the small **observed** liquidity versus large **latent** liquidity phenomenon.  

4. The expected profit of the informed trader's optimal strategy is given by 

   $$\begin{align*}
   \E[\mathrm{PnL}] &=  \E[V_{\mathrm{IT}}^{*}(p_1-p_{\mathrm{MM}}^{*})] \\
   &= \frac{1}{2\Lambda} \E[ \Delta p (\Delta p  - \Lambda \Delta V)]\\
   &= \frac{1}{2}\sigma_p\sigma_{\mathrm{NT}} 
   .\end{align*}$$

    In particular, the informed trader also benefits from the presence of noise traders, via the liquidity they provide to the market in the form of reduced market impact. 

5. Finally, the expected pricing error of the market maker's quote is given by 

    $$\begin{align*}
    \var(p_{1}-p_{\mathrm{MM}}^{*}) &=   \var\left( \frac{1}{2}\Delta p - \Lambda V_{\mathrm{NT}} \right) \\
    &= \frac{1}{2}\sigma^2_p
    .\end{align*}$$

    Thus, while on average the market maker will break even, this mispricing introduces variation in their PnL arising from the combination of losses incurred by trading against the informed trader and gains incurred by trading with the informed traders.

# 3. Estimating Kyle's lambda
Having established several interesting  under a simplified linear market model, the first question we should ask ourselves is how reasonable is this model (and by extension, how much significance should we place in its' conclusions). This question effectively translates into stress testing the reasonableness (or lack thereof) of the model's assumptions. All three explicit assumptions we made have an extensive history of being scrutinized, not to mention the various assumptions we made that we did not emphasize (like that market makers can liquidate their inventories without themselves occurring market impact). Focusing our attention on assumptions (1)-(3), we know, at least as far back Mandlebrot, that asset prices are not Gaussian, nor are their logarithms (i.e. cumulative returns) Gaussian. More generally, there is significant evidence that the weak efficient market hypothesis does not hold, not least the fact that, indeed, market making does seem to be profitable. Regarding assumption (2), a few decades ago, the very existence of noise traders was a high controversial idea, as {% cite BLACK86 --file profitability-of-market-making.bib %} highlights. We focus our attention on assumption (3), namely, that market impact is linear, as this was a novelty introduced by Kyle, and moreover, it has the most interesting implications for microstructure theory. 

We focus on the TAQ data for TSLA in the first three months of 2015. As a standard cleaning procedure, we discard trades which occur within the first and last hour of the trading day. 

<div class="text-center">
{% include figure.liquid 
   path="/assets/img/blogs/2026/profitability-of-market-making/trade-time.png"
   caption="Figure 2: Proportion of LOB updates per minute that are market orders for TSLA on 01/02/2015. Red lines denote first and last hours of trading day"
   class="img-fluid rounded z-depth-1"
%}
</div>

So, how can we actually measure market impact? Intuitively, to estimate Kyle's lambda, we want to regress price changes against order flow. The first challenge with this is that, given only publicly available data, we cannot isolate the market impact of an individual trader. In order to mitigate the resulting impact, large trades (aka *metaorders*) are partitioned into smaller batches (*child orders*) and executed sequentially. How best to execute these orders to balance the tradeoff between market impact is the field of *optimal execution*, going back to the seminal work {% cite AC01 --file profitability-of-market-making.bib %}.

Our simplest next best option is to look at the changes in mid price of a stock conditioned on the volume of incoming market orders, which only requires TAQ data. We consider all processes with respect to **trade time**, i.e., $$t$$ represents the time at which the $$t^{th}$$ market order arrives. We let $$b_t$$ and $$a_t$$ denote the bid and ask *just before* time $$t$$, so that the market order is filled either at $$b_t$$ (in the case of a sell order), or else $$a_t$$. Let $$m_t = (a_t+b_t) / 2$$ denote the corresponding mid price. We follow {% cite SK25 --file profitability-of-market-making.bib %}, and use the standing assumption that consecutive market orders with the same sign are child orders belonging to the same metaorder.

Thus, let $$1=\tau _1 < \tau _2 <\ldots$$ denote the random times $$\varepsilon_{\tau _n} \coloneqq \{s \geq \tau _{n-1}: \varepsilon_s \neq \varepsilon_{\tau _{n-1}}\} $$ at which the sign of the incoming market order changes. We define the **(normalized) market impact** $$\mathcal{I}(\mathcal{Q})$$ as the conditional expectation

$$\mathcal{I}(\mathcal{Q})\coloneqq \frac{1}{\sigma_D}\E\biggr[\varepsilon_{\tau _n}(m_{\tau_{n+1}}-m_{\tau _n})\biggr| \frac{1}{V_D}\sum\limits_{t=\tau _{n}}^{\tau _{n+1}-1}q_t = \mathcal{Q} \biggr] 
$$ 

where $$\sigma_D$$ denotes the daily volatility of the mid price increments $$\Delta m_t = m_{t+1}-m_t$$, and $$V_D$$ denotes the daily trading volume. Thus $$\mathcal{I}(\mathcal{Q})$$ represents the average change in (normalized) signed mid price after the arrival of a ``metaorder", conditioned on the order's (normalized) volume. 

<div class="text-center">
{% include figure.liquid 
   path="/assets/img/blogs/2026/profitability-of-market-making/price-impact.png"
   caption="Figure 3: Impact function $\mathcal{I}(\mathcal{Q})$ for TSLA. Fitted curve is of the form $c\mathcal{Q}^\delta$ for $c=7$ and $\delta=0.7$."
   class="img-fluid rounded z-depth-1"
%}
</div>

We see in Figure 3 that the market impact for TSLA is concave, well-approximated by a power law $$\mathcal{I}(\mathcal{Q}) \approx c \mathcal{Q}^{\delta}$$ with $$\delta$$ near $$\frac{1}{2}$$ and $$c$$ of order 1. This is known as the *square root law* of market impact, and remains one of the most enduring and ubiquitous empirical phenomena in market microstructure. The consequences of a square root impact law in place of the linear impact hypothesis by Kyle's model are quite significant. Indeed, taking $$\delta=\frac{1}{2}$$ and $$c=1$$, under square root impact, trading a meta order of only 1\% of a stock's daily volume moves the mid price 10;% of its daily volatility. The significant impact induced by relatively small orders is quite surprising, and provides justification to the importance trading firms place on optimal execution.

While impact is a (strongly) concave function of metaorder volume, the validity of Kyle's model is not entirely lost. The reason for this is that Kyle's model argues for signed price changes being linear is *net order flow*, i.e., the aggregation of signed volume of trades belonging to various meta orders. Thus, given $$T>0$$, we define the (liquidity-taking) **order-flow imbalance** (OFI) over $$[t,t+T)$$ by 

$$
\Delta V = \Delta V(t,T) \coloneqq \sum\limits_{n = 0}^{T-1} \varepsilon_{t+n} q_{t+n}
.$$ 

The order-flow imbalance represents the aggregate net demand for liquidity taking over a period of time. Using this, we can define the **aggregate (signed) impact** over horizon $$T$$ by 

$$
\mathcal{R}(v, T)= \E\left[ m_{t+T}-m_t \biggr| \Delta V = v  \right] 
.$$ 

Thus, $$\mathcal{R}(v, T)$$ represents the average mid-price change after the arrival of $$T$$ market orders, conditioned on order-flow imbalance. Upon normalizing, $$\lvert R(v,T)\rvert $$ is also found to be concave in $$v$$ at various time horizons $$T$$, and moreover {% cite PB18 --file profitability-of-market-making %} identified the following empirical scaling law: 

$$
        \frac{\mathcal{R}(v, T)}{\mathcal{R}(1) T^{\chi}} \approx F \left( \frac{v}{V_D T^{\kappa}} \right) 
$$

where $$\mathcal{R}(1)=\E[\varepsilon_{t}(m_{t+1}-m_t)]$$, and $$F$$ is a sigmoid function, i.e. $$F(v)$$ is linear for small values $$\lvert v\rvert \ll 1$$, and $$\lvert F(v)\rvert$$ is concave for large values. The exponents are found to be in the ranges $$\chi \in (0.5,0.7)$$ and $$\kappa \in (0.75,1)$$. Let's take a moment to think about how this contrasts with Kyle's model. Under the above scaling law, it follows that as we aggregate of smaller horizons $$T\to 0$$, $$\Delta V \to 0$$ and consequently Kyle's lambda decreases:

$$
\mathcal{R}(\Delta V,T) \propto_{\Delta V \to 0}  \frac{1}{T^{\kappa-\chi}}\Delta V \eqqcolon \Lambda(T)\Delta V
.$$

In contrast, in the multi-period version of Kyle's model, aggregate impact is linear and  additive \emph{across} time, so $$\Lambda$$ (and hence $$F$$) is independent of $$T$$.

<div class="text-center">
{% include figure.liquid 
   path="/assets/img/blogs/2026/profitability-of-market-making/kyle's-lambda.png"
   caption="Figure 4: Scaling function $F(x)=\sgn(x)\lvert x\rvert^\gamma$ calibrated to normalized aggregate impact for TSLA over various horizons $T$. Kyle's lambda depicted by slope of dashed grey curve."
   class="img-fluid rounded z-depth-1"
%}
</div>

We would like to calibrate such a scaling function to our data, and subsequently measure the resulting linear fit near $$\Delta V =0$$. We use the sigmoid $$F(x)=\gamma \sgn(x)\lvert x\rvert^{\tau}$$ for $$0 < \tau  \ll 1$$. Note this introduces an indeterminacy in identifying $$\kappa$$ and $$\chi$$, as the level sets of the plane $$f(\kappa, \chi)=\tau  \kappa - \chi$$ will induce the same function. In any case, the results of the parameter estimation for various values of $$T$$ are displayed in Figure 4, with the dashed lines showing the sigmoid fit, and the solid lines the empirical impact functions. We estimate $$\tau =0.4$$, $$\kappa=0.9$$, $$\chi = 0.6$$, and $$\gamma=47$$. The grey dashed line has slope $$\Lambda=11000$$.

Let's recap what we have covered:

1. If prices are martingales, i.e., the weak EMH, market-making in the sense of buying low and selling high to profit off of the spread is not profitable on average.

2. In a linear world, where prices and order flow are Gaussian and market makers set prices via linear impact, we can obtain explicit forms for price takers' optimal trade sizes and market makers' optimal market impact coefficients. This is the content of Kyle's model.

3. In the real world, impact is concave, not linear. When measured in terms the average change in mid price, the impact of metaorders obeys a square root law. On the other hand, aggregate (unsigned) impact is linear in net order flow for small values $$\lvert\Delta V \rvert \approx 0$$. In such cases, the value of Kyle's lambda depends on the aggregation horizon, decreasing like $$\Lambda(T)\approx \Lambda T^{-c}$$ for $$c \approx 0.3$$.

# References

<div class="post-bibliography">
{% bibliography --cited --file profitability-of-market-making --template bib_post --group_by none %}
</div>