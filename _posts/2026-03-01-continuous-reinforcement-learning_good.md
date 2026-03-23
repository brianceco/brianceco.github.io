---
layout: post
title: (continuous) Reinforcement Learning
date: 2026-03-01 14:24:00
description: 
tags: reinforcement_learning 
toc: 
  beginning: true
---


\section{Introduction}
Reinforcement learning (RL) is a machine learning paradigm which formalizes the \*trial-and-error* approach to learning: an \*agent* interacts with an \*environment* via some \*policy* they can control, so as to maximize some \*reward*. It has been widely successful in achieving high level performance in a wide range of activities, including games (e.g., GO [link], chess [link], Dota [link]), and more recently finance. More recently, with the introduction of RL into the Large Language Model training stack, it has played an integral part in achieving state-of-the-art performance in more abstract disciplines, such as coding and mathematics.

The following blog post aims to give a 

We can decompose this trial-and-error approach into three constituent  
\begin{enumerate}[1.]
        \item (\*Exploration*). 
        \item (\**)
\

can be (roughly) characterized along the following constituent dimensions. 


\section{Discrete-time RL/Introduction/Motivation}
We first begin by quickly recalling RL theory in discrete time and space, fixing notation and outlining what results we actually want to extend to the continuous setting.

We consider a (time-homogeneous) Markov Decision Process (MDP) $\{X_t\} _{t =0}^{\infty}$ with finite state space $\mathcal{X}$ and finite action space $\mathcal{A}$. The dynamics of $X_t$ are governed by a transition kernel $p(x^\prime|x,a)\coloneqq \mathbf{P}(X_{t+1}^{a}=x^\prime|X_{t}=x,A_t=a)$ from $\mathcal{X} \times \mathcal{A}$ to $\mathcal{X}$, where $\{A_{t}\}_{t=0}^{\infty}$ is the action process following an admissible policy $A_t \sim \pi(da|X^{A}_t) \in \mathcal{P}(\mathcal{A})$. We are interested in the episodic setting, in which our environment evolves over some finite time horizon $T \in \mathbf{N}$. The goal is to identify an admissible policy $\pi^{*}=\pi^{\phi  ^{*}}$ from some parametric family $\phi   \in \Phi \subset \mathbf{R}^{N_\phi  }$ which is *optimal* from the point of view that it maximizes the value function 
$$
J(x;\pi) \coloneqq \EE_{x}\left[ \sum\limits_{t=0}^{T}\beta ^{t} r(X^{A}_t,A_t) \right] 
$$ 
defined as the cumulative discounted expected reward, with discount rate $\beta  \in (0,1)$ and reward function $r\colon \mathcal{X} \times \mathcal{A}\to \mathcal{P}(\mathbf{R})$.

We aim to identify an optimal policy via gradient ascent along the value function for the current policy $\pi^{\phi}$ (i.e., the \*actor*). Since the true value function is unavailable to us, must reformulate the policy gradient $\partial J / \partial \theta ^{\phi }$ in terms of the value function and/or Q-function, which we substitute with an estimate $J^{\theta}(x)$ (i.e. the \*critic*). Any \*Actor-Critic (AC) algorithm* consists of iteratively carrying the following two steps:
\begin{enumerate}[1.]
        \item (\*Approximation in value space* $\Theta$). Given the current policy $\phi$, we need to estimate the associated value function $J^{\theta}(x)\approx J(x;\phi)$ from some parametric class $\theta  \in \Theta \subset \mathbf{R}^{N_{\theta }}$. This is the \*policy evaluation* (\*PE*) step.  
        \item (\*Approximation in policy space* $\Phi$). We update our policy estimate via gradient ascent along the value function $J(x;\phi _m)$ at the current state $X^{\phi _t}_t$: \[
\phi  \leftarrow \phi  + \alpha \frac{\partial J}{\partial \phi _t}(X_{t}^{\phi};\phi )
.\] This is the \*policy improvement* (or \*policy gradient* (\*PG*)) \*step*.
\
Regarding estimation in value space, various \*gradient-based* PE algorithms can be found within the RL literature, in both the offline and online setting, which all update the critic parameter $\theta _n$ via (stochastic) gradient descent along some target estimate $\widetilde{J}(x)$ for the value function $J(x;\phi _m)$: \begin{align}\label{SGDPE}
        \theta &\leftarrow \theta -\frac{1}{2} \alpha \frac{\partial }{\partial \theta } (\widetilde{J}(X^{\phi }_t)-J^{\theta}(X^{\phi }_t))^2\\
& =\theta  + \alpha \left( \widetilde{J}(X^{\phi }_t)-J^{\theta}(X^{\phi }_t) \right) \frac{\partial J}{\partial \theta } (X^{\phi }_t) 
.\end{align} 
This defines \*gradient-based methods*. If $\widetilde{J}(x)$ is an unbiased estimate of $J(x;\phi )$, then . A popular choice of offline algorithm is taking $\widetilde{J}(X_t^{\phi })=G_t \coloneqq \sum\limits_{k=t}^{T} r(X_t^{\phi }, A^{\phi }_t)$ the \*return* from time $t$ onwards, which defines the (\*gradient*) \*Monte Carlo* algorithm. There are also popular choices for the target estimate which themselves depend on the current critic parameter $\widetilde{J}^{\theta}(x)$. For example, we can take the \*temporal difference* (TD(0)) target $\widetilde{J}(X_t^{\phi })=r(X_{t}^{\phi },A^{\phi }_t)+J^{\theta}(X_{t+1}^{\phi})$. If we use as our update step the true gradient of the of the squared error, we get the \*gradient TD(0)* GTD(0) algorithm. Often times however it is useful to still use the second line in \ref{SGDPE} to update $\theta _n$, ignoring the effect of changing $\theta _n$ on the target $\widetilde{J}^{\theta }(x)$, as this leads to faster learning. Since this corresponds to a stochastic approximation learning algorithm which is not minimization of the gradient of a loss function, they are consequently called \*semi-gradient methods* of PE.

The PG step boils down to estimating the gradient $\frac{\partial J}{\partial \phi } (x;\phi )$ of the critic. In order to develop approximation algorithms, we must first characterize this gradient in a way that is amenable to estimation via observed data. Recalling the definition of the value function, taking the (iterated) conditional expectation with respect to the first action $A_0^{\phi}$, we have \[
J(x_0;\phi )= \sum\limits_{a_0 \in \mathcal{A}}^{} \pi^{\phi }(a_0|x_0)Q^{\phi }(x_0,a_0)
\] where $Q(x,a;\phi )\coloneqq\EE_{x,a}\left[ \sum\limits_{t=0}^{T} \beta ^{t}r(X^{\phi }_t,A^{\phi }_t) \right] $ is the $Q$-function associated to $\pi^{\phi}$. Taking the gradient with respect to $\phi $ yields 
\[
        \frac{\partial J}{\partial \phi } (x_0;\phi ) =   \sum\limits_{a_0 \in \mathcal{A}}^{} \frac{\partial \pi^{\phi }}{\partial \phi } (a_0|x_0) Q(x_0,a_0;\phi ) + \pi^{\phi }(a_0|x_0)\frac{\partial Q}{\partial \phi } (x_0,a_0;\phi )
.\]
We consequently unroll the $Q$-function one step forward in time by conditioning on $X^{\phi }_1$, using the Markovian structure of $(X^{\phi }_t,A_t^{\phi })$:$$
Q(x_0,a_0;\phi )=\EE[r(x_0,a_0)] + \beta \sum\limits_{x_1 \in \mathcal{X}}^{} p(x_1|x_0,a_0)J(x_1;\phi )
\] where implicitly we note $J(x_1;\phi)$ is a summation up to $T-1$. Substituting this into the previous equation yields \begin{align*}
        \frac{\partial J}{\partial \phi } (x_0;\phi ) =   \sum\limits_{a_0 \in \mathcal{A}}^{} \frac{\partial \pi^{\phi }}{\partial \phi } (a_0|x_0) Q(x_0,a_0;\phi ) + \beta\pi^{\phi }(a_0|x_0) \sum\limits_{x_1 \in \mathcal{X}}^{}p(x_1|x_0,a_0) \frac{\partial J}{\partial \phi } (x_1;\phi )
.\end{align*} 
Iterating this procedure, we obtain \[
        \frac{\partial J}{\partial \phi } (x_0;\phi ) = \sum\limits_{x \in \mathcal{X}}^{} \rho ^{\phi }_{x_0}(x) \underbrace{\sum\limits_{a \in \mathcal{A}}^{} \frac{\partial \pi^{\phi }}{\partial \phi } (a|x)Q(x,a;\phi )}_{\eqqcolon \ell (x)}
\] where $\rho^{\phi }_{x_0}(x)\coloneqq\sum\limits_{t=0}^{T} \beta ^{t}\mathbf{P}_{x_0}(X^{\phi }_t=x)$ is the \*(discounted) occupation time* at state $x$. The current formulation of the gradient cannot be efficiently estimated via a single sample $(X^{\phi }_t,A^{\phi }_t)$ as it requires estimating the gradient of the policy and associated $Q$-function over all state-action pairs. To overcome this, we rewrite the gradient as \begin{align*}
\frac{\partial J}{\partial \phi } (x_0;\phi ) &=   \sum\limits_{x \in \mathcal{X}}^{} \EE_{x_0}\left[ \sum\limits_{t=0}^{T} \beta ^{t}\bm{1}_{\{X^{\phi }_t=x\} } \right] \ell (x)\\
&= \EE_{x_0} \left[\sum\limits_{t=0}^{T} \beta ^{t}  \sum\limits_{x \in \mathcal{X}}^{}\bm{1}_{\{X^{\phi }_t=x\} }\ell (X^{\phi }_t)  \right]  \\
&= \EE_{x_0} \left[ \sum\limits_{t=0}^{T} \beta ^{t} \ell (X^{\phi }_t) \right] \\
&= \EE_{x_0} \left[ \sum\limits_{t=0}^{T} \beta ^{t} \sum\limits_{a \in \mathcal{A}}^{} \pi^{\phi }(a|X^{\phi }_t)\frac{\partial \log \pi^{\phi }}{\partial \phi } (a|X^{\phi }_t) Q(X^{\phi }_t,a;\phi ) \right] \\
&=  \EE_{x_0}\left[ \sum\limits_{t=0}^{T} \beta ^{t} \EE\left[ \frac{\partial \log \pi^{\phi }}{\partial \phi } (A^{\phi }_t|X^{\phi }_t)Q(X^{\phi}_t,A^{\phi }_t;\phi )|X^{\phi }_t \right]  \right] \\
&=  \EE_{x_0}\left[ \sum\limits_{t=0}^{T} \beta ^{t} \frac{\partial \log \pi^{\phi }}{\partial \phi } (A^{\phi }_t|X^{\phi }_t)Q(X^{\phi}_t,A^{\phi }_t;\phi ) \right] \\
&=  \EE_{x_0}\left[ \sum\limits_{t=0}^{T} \beta ^{t} \frac{\partial \log \pi^{\phi }}{\partial \phi } (A^{\phi }_t|X^{\phi }_t)\left(Q(X^{\phi}_t,A^{\phi }_t;\phi ) -B(X^{\phi })\right)\right] 
\end{align*} 
where in the last line $B(x)$ is an arbitrary function of the state, called the \*baseline*, and we have made use of the fact that $\sum\limits_{i=1}^{N_\phi } \partial \log \pi^{\phi } / \partial \phi =0$. Thus, we have represented the gradient of the critic as an expectation with respect to a given sample $\{(X^{\phi }_t,A^{\phi }_t)\}_{t=0}^{T}$. This formulation of the policy gradient lends itself to both offline and online algorithms, where in the latter case at time $t$, we update $\phi $ using only the state-action pair $(X_t^{\phi },A^{\phi }_t)$, rather than the entire trajectory. 

Of course, in place of the true $Q$-function, we use the estimate $Q^{\theta }(x,a)$ from our PE step. If in place of $Q(X^{\phi }_t,A^{\phi }_t;\phi )$, we instead had the return $G^{\phi }(X^{\phi }_t,A^{\phi }_t)$ from time $t$ onwards, we would get the actor-only \*REINFORCE with baseline* algorithm. 

The benefit of including a baseline is that we get an estimator for the gradient of the critic which remains unbiased but with potentially smaller variance. The most common choice of baseline is $B(x)=J^{\theta }(x;\phi _t)$, the estimate of the value function for the current policy, yielding the \*advantage AC (A2C) algorithm*. In this setting, the policy parameter intuitively updates $\phi _{t+1}\leftarrow \phi _t$ in the direction which maximizes the log-likelihood of the current policy with respect to the current action $A^{\phi _t}_t$, with the step size scaled by the \*advantage* of that action, the latter defined by \[
        \mathit{Ad}^{\theta }(X^{\phi }_t,A^{\phi }_t;\phi)\coloneqq Q^{\theta }(X^{\phi}_t,A^{\phi };\phi )_t - J^{\theta }(X^{\phi }_t;\phi _t)
.\] 


\section{Continuous RL via Stochastic Control}
\subsection{Exploration: relaxed stochastic control}
One way to motivate the stochastic control formulation of cRL is as follows. Stochastic control (SC) and reinforcement learning (RL) are both methods for optimizing sequential decision making with respect to a given reward function. The idea is that an agent is able to interact with their environment (state) via a series of actions (controls). Where SC and RL diverge is that the former is \*model-based*, i.e. it presumes one has perfect knowledge of the dynamics by which the state/environment evolve, and consequently seeks to obtain existence/uniqueness results for an optimal \*feedback* control defined in terms of a deterministic policy of the state. In contrast, RL begins from a starting point of incomplete information, where an agent only learns about the (unknown) dynamics of their environment via their interaction with it, generating a realization from which the agent can learn an (approximately) optimal policy. In order to achieve this, the agent chooses actions both to \*optimize their reward* (as in SC) and to \*explore their environment*. It is this latter condition which necessitates actions being sampled \*randomly* according to a policy (distribution), independently of the randomness of the environment.

Both SC and RL evolve according to the state-action-reward-state dynamic programming paradigm.

In order to motivate the stochastic-control formulation of continuous RL, we begin with the classical stochastic-control setting. We fix the canonical path space $\Omega=C([0,T], \mathbf{R})$ equipped with the Borel $\sigma$-algebra $\mathcal{B}$ associated to the topology of uniform convergence and the Wiener measure $\mathbf{P}_W$. We let $\mathcal{F}^{W}_t$ denote the associated filtration generated by $W _t$. We consider a state process $X_t^{a}$ which evolves via an It\^o diffusion \[
        dX^{a}_t = b(t,X_t,a_t)dt  + \sigma(t,X_t,a_t)dW_t
.\] We assume for the moment every process in sight is one-dimensional for simplicity. Here $a_t$ is our control process, taking values in the action space $A \subset \mathbf{R}$. We seek to maximize the value function \[
J^{a}(t,x)\coloneqq  \EE_{t,x}^{\mathbf{P}^{W}}\left[ \int_{t}^{T} e^{-\beta (s-t)}h(s,X^{a}_s,a_s)\,dt +e^{-\beta (T-t)} g(X^{a}_T) \right] 
\] given by the expected discounted running and terminal rewards $h(t,x,a)$ and $g(x)$ over a finite time horizon $T>0$ (i.e. \*episodic* stochastic control). Thus, we sought a function $a(t,x)$ so that the value function $J^{*}(t,x)$ of the feedback policy $a^{*}_t = a(t,X^{a^{*}}_t)$ satisfied \[
J^{*}(t,x)\coloneqq J^{a^{*}}(t,x) = \sup _{a_t \in \mathcal{A}}J^{a}(t,x)
\] where $\mathcal{A}$ was some admissible class of controls.

To ensure the classical stochastic control problem is well-posed, we assume the following standard conditions.
\begin{assumption}[well-posed SCP]
     \begin{enumerate}[1.]\leavevmode
             \item The functions $b,\sigma, r,h$ are continuous in their respective arguments.
             \item The coefficients $b,\sigma$ are uniformly Lipschitz continuous with linear growth in $x$.
             \item $r$ and $h$ have polynomial growth in $(x,a)$ and $x$ respectively.
     \   
\end{assumption}
The first assumption is a convenience so we remain on the canonical path space of continuous functions indexed by $[0,T]$. The second assumption guarantees strong existence and uniqueness of $X^{a}$, together with a bound $\EE\sup_{t \in [0,T]}|X_t|^{\mu } \leq C\EE|X_0|^\mu $ for any $\mu  \geq 2$. The third assumption ensures the value function is finite at all times.

Translating this into the RL paradigm amounts to injecting randomness into our action process. To do so, we extend our probability space via $\mathbf{P}=\mathbf{P}_W\times \mathbf{P}_Z$, where $Z\sim \mathrm{Unif}([0,1])$ governs the exploration of our actions. Namely, we now consider (absolutely-continuous) \*distribution-valued controls* $\pi_t \in \mathcal{P}(A)$, aka \*policies*, which are moreover Markovian in the sense that they have the feedback form $\pi_t(da)=\pi(da|t,x)$. We then consider a \*randomized* action process $A^{\pi}_t \sim \pi_t$ sampled according to our policy. We can formalize this for example by defining \[
        A^{\pi}_t \coloneqq Q_{\pi(dA|t,X^{\pi}_t)}(Z)
        \] $Q$ denotes the quantile function of $\pi(da|t,X^{\pi}_t)$, and $X^{\pi}(t)$ is the state process \[
        dX^{\pi}_t = b(t,X^{\pi}_t,A^{\pi}_t)dt + \sigma(t,X^{\pi}_t,A^{\pi}_t)dW_t
.\] Of course, $a^{\pi}$ is defined recursively in terms of the state $X^{\pi}$, so we must guarantee that this SDE (with randomized coefficients given the dependence on $Z$) exists, which requires some reasonable assumptions on the policy $\pi$. Now that we have randomized actions and state dynamics, we can formulate the objective of our continuous RL problem, which is simply to optimize the \*exploration-regularized* value function \[
J^{\pi}(t,x) \coloneqq \EE_{t,x}^{\mathbf{P}}\left[ \int_{t}^{T} e^{-\beta (s-t)}(r(s,X^{\pi}_s,A^{\pi}_s) - \gamma \log \pi(A^{\pi}_s|s,X^{\pi}_s) \,ds +e^{-\beta (T-t)} g(X^{a}_T) \right] 
\]  where we have introduced the entropy regularization $H(\pi)\coloneqq - \log \pi$  and temperature parameter $\gamma \geq 0$ to encourage exploration. Because we will use it repeatedly, for convenience we abbreviate the non-discounted integrand \[
F(t,x,a,\pi)\coloneqq  r(s,x,a) + \gamma H(\pi)
.\] 

While we have setup a reasonable model for continuous RL, from a theoretical standpoint, it is kind of annoying that we are working with controls $a_t^{\pi}$ randomized exogenously to our state noise $W_t$. This introduces questions about exactly which tools from classical stochastic control we can apply to our setting. In order to resolve such technical points, we would like to \*integrate out* the policy randomization from our state process. The key observation is that, conditioned on the state $X_t^{\pi}$, the drift and variance processes satisfy \[
        \overline{b}(X^{\pi}_t,t)\coloneqq \EE[b(t,X^{\pi}_t,A^{\pi}_t) |X_t^{\pi}]= \int_{\mathcal{A}}^{} b(t,X^{\pi}_t,a)\pi(a|t,X^{\pi}_t)\,da
\] and \[
\widetilde{\sigma}^2(X^{\pi},t) = \int_{\mathcal{A}}^{} \sigma^2(t,X^{\pi}_t,a)\pi(a|t,X^{\pi}_t)\,da
.\] 
This motivates the \*relaxed control* state process $\overline{X}_t^{\pi}$ characterized by the SDE \[
        d \overline{X}_t^{\pi} = \overline{b}(t,\overline{X}_t^{\pi})dt + \overline{\sigma}(t,\overline{X}_t)dW_t
\] where \[
\overline{b}(x,t) \coloneqq \int_{A}^{} b(t,x,a)\pi(da|t,x) \hspace{10pt} \text{and}\hspace{10pt} \overline{\sigma}(x,t)\coloneqq\sqrt{\int_{A}^{} \sigma^2(t,x,a)\pi(da|t,x)} 
.\] Thus, $\overline{X}_t^{\pi}$ represents the environment dynamics where we have averaged out the policy exploration $\pi_{t}$. While $X^{\pi}_t$ can be observed by sampling the policy $A^{\pi}_t \sim \pi(da|t,X^{\pi}_t)$, $\overline{X}^{\pi}_t$ is unobservable. The authors motivate the definition of $\overline{X}_t^{\pi}$ via a law of large numbers argument which was formalized in \cite{JOZ25}. In fact it is somewhat nontrivial to show that the two processes agree in law. That the distribution of the 1-dimensional marginals of $X_s^{\pi}$ and $\overline{X}_s^{\pi}$ coincide is an immediate consequence of Corollary 4.7 of the ``Markovian projection formula" of Brunick and Shreve ([\cite{BS13}]). In particular, this implies by Fubini's formula that the value function of the exploratory control coincides with the value function of the relaxed control \[
J^{\pi}(t,x) = \EE^{\mathbf{P}^{W}}_{t,x}\left[ \int_{t}^{T} e^{-\beta (s-t)}\int_{A}^{} F(t,\overline{X}^{\pi}_{t},a,\pi)\pi(a|t,\overline{X}^{\pi}_t)\,dadt + e^{-\beta (T-t)}h(\overline{X}^{\pi}_T) \right] 
.\] We denote by $\overline{F}(t,x,a,\pi) = \int_{A}^{} F(t,\overline{X}^{\pi}_t,a,\pi)\pi(a|t,\overline{X}^{\pi}_t)\,da$ the associated non-discounted integrand.

To finish the setup, we restrict the policies we consider to some admissible space $\pi \in \mathbf{A}\subset \mathcal{P}(\mathcal{A})^{[0,T] \times \mathbf{R}^{d}}$ to ensure the relaxed control problem is well-posed. Namely, under some reasonable Lipschitz continuity and polynomial growth conditions similar to Assumption 1, we can guarantee the relaxed control state SDE admits a unique strong solution which also satisfies \[
        \EE^{\mathbf{P}^{W}}[\sup _{0 \leq t \leq T}|\overline{X}^{\pi}_t|^{\mu }]  \leq C(1+|x| ^{\mu })
.\] 

\subsection{Evaluation: PE via martingality conditions}
The first stage in the recursive \*actor-critic algorithm* is \*policy evaluation*. Namely, suppose we have an admissible policy $\pi^{\phi}$ whose value function $J(t,x)\coloneqq J(t,x;\phi )$ we would like to approximate $J^{\theta}(t,x)$. In order to devise algorithms for estimating the critic $J^{\theta }(t,x)$, we need useful characterizations of the value function. We have two, both of which follow from the observation that \begin{equation}\label{PEmartingale}
        \widetilde{M}_t \coloneqq e^{-\beta t}J(t,\widetilde{X}_t) + \int_{0}^{t} e^{-\beta s} \widetilde{F}(s,\widetilde{X}_s)\,ds
\end{equation} is a $(\mathcal{F}^{\overline{X}}_t, \mathbf{P}^{W})$-martingale in the case $\widetilde{X}=\overline{X}$ and $\widetilde{F}=\overline{F}$, and a $(\mathcal{F}^{X^{\pi}}_t, \mathbf{P})$-martingale in the case $\widetilde{X}=X^{\pi}$ and $\widetilde{F}=F$.

\begin{thm}[Martingality characterization of the value function]\label{thm1}
        Let $J^{\theta }\colon [0,T] \times \mathbf{R}^{d} \to \mathbf{R}$ be a $C^{1,2}$ function such that $J^{\theta }(T,x)=h(x)$. Define $M^{\theta }_t$ as in Equation \ref{PEmartingale} with $J$ replaced by $J^{\theta }$. The following are equivalent:
        \begin{enumerate}[1.]
                \item $J^{\theta }=J$ is the value function.
                \item For any initialization $(t,x)\in [0,T) \times \mathbf{R}^{d}$, the process \[
                              \overline{M}^{\theta }_s \coloneqq  e^{-\beta  s}J^{\theta }(s,\overline{X}^{\pi}_u) + \int_{t}^{s} e^{-\beta  s}\overline{F}(u,\overline{X}^{\pi}_u)\,du
                        \] is a $(\mathcal{F}_{t}^{\overline{X}^{\pi}},\mathbf{P}^{W})$-martingale on $[t,T]$.
                \item (Martingale orthogonality). For every $(\mathcal{F}_t^{X^{\pi}}, \mathbf{P})$-progressively measurable bounded process $\xi_t$, \[
                                \EE^{\mathbf{P}}\int_{0}^{T} \xi_t\,dM^{\theta }_t=0
                .\] 
        \
        
\end{thm}
\begin{proof} 
That the true value function satisfies both (2) and (3) is immediate from It\^o's formula. To see (2) implies (1), we note that \begin{align*}
        e^{-\beta  t}\widetilde{J}(t,x)&=   \overline{M}_t \\
                          &= \EE^{\mathbf{P}^{W}}[\overline{M}_T|\mathcal{F}^{\overline{X}^{\pi}}_t]\\
                          &= \EE^{\mathbf{P}^{W}}[\overline{M}_T|\overline{X}^{\pi}_t=x]  \\
                          &= e^{-\beta t}J(t,x)  
\end{align*} where we used the Markov property for $\overline{X}^{\pi}_t$ in line 3. 

We will now show (3) is equivalent to (2). Firstly note that\[
dM^{\theta }_t =  dJ^{\theta }(t,\overline{X}^{\pi}_t)+F(t,\overline{X}^{\pi}_t,a,\pi)dt-\beta \widetilde{J}^{\pi}(t,\overline{X}^{\pi}_t)dt.
\] It is clear that if $\overline{M}^{\theta }_t$ is a martingale then integrating any bounded test process $\xi_t^\prime=\xi_t e^{\beta t}$ against $\overline{M}_t$ yields a mean zero martingale proving (2) implies (3). For the converse, by It\^o's lemma, $M^{\theta }_t$ is a diffusion $M^{\theta }_t=\int_{0}^{t} \widetilde{b}_s\,ds + \int_{0}^{t} \widetilde{\sigma}_s\,dW_s$ for some $\mathcal{F}^{X^{\pi}}$-adapted processes $\widetilde{b}_t, \widetilde{\sigma}_t$. Taking $\xi_t$ an arbitrary finite variation process, we conclude $b_t=0$, hence $M^{\theta }_t$ is a $(\mathcal{F}^{X^{\pi}}_t,\mathbf{P})$-martingale.

Now to show that this completes the proof, note that any $(\mathcal{F}^{X^{\pi}}_t,\mathbf{P})$-progressively measurable process $\xi_t$ takes the form $\xi_t \coloneqq \xi(t,X_{t \wedge \bullet }^{\pi})$ for some measurable map $\xi\colon [0,T] \times C([0,T], \mathbf{R})\to \mathbf{R}$. Defining $\overline{\xi}_t\coloneqq \xi(t,\overline{X}^{\pi}_{t \wedge \bullet } )$, we observe 
\begin{align*}
       \EE^{\mathbf{P}}\left[ \int_{0}^{T} \xi_t\,dM^{\theta }_t \right] =  \EE^{\mathbf{P}^{W}}\left[ \int_{0}^{T} \overline{\xi}_te^{\beta  t}\,d\overline{M}^{\theta }_t \right] 
.\end{align*}
\end{proof}

This theorem allows us to generalize various PE algorithms from discrete to continuous time. 
\begin{enumerate}[1.]
        \item  Using the 1st martingality characterization of the value function, we can choose $\theta \in \Theta $ via minimization of the mean-square error \begin{align*}
                        \mathrm{ML}(\theta )&\coloneqq \|M^{\theta }_{T}-M^{\theta }\|_{\mathbf{L}^2(\mathcal{F}^{X^{\pi}}_t)}^2\\
     & = \EE^{\mathbf{P}}\left[ \int_{0}^{T}\left( e^{-\beta  T}h(X_T^{\pi})-e^{-\beta t}J^{\theta }(t,X^{\pi}_{t}) + \int_{t}^{T} e^{-\beta s}F(s,X^{\pi}_s,a^{\pi}_s,\pi)\,ds\right)^2\,dt \right] 
        \end{align*} via SGD. The function $\mathrm{ML}(\theta )$ is known as the \*martingale loss function* and can be seen as a continuous-time analogue of gradient Monte Carlo.
        \item Using the martingale orthogonality condition with test process $\xi_t = \frac{\partial J^{\theta }}{\partial \theta }(t,X^{\pi}_t)$, via stochastic approximation the corresponding update step is\[
        \frac{\partial J^{\theta }}{\partial \theta}(t,X^{\pi}_t) dM^{\theta }_t \approx \left( J^{\theta }(t+\Delta t,X^{\pi}_{t+\Delta t}) + r(t,X^{\pi}_{t},A^{\pi}_{t})\Delta t - J^{\theta }(t,X^{\pi}_{t}) + \gamma H(\pi(A^{\pi}_t|t,X^{\pi}_t))\Delta t)\right) \frac{\partial J^{\theta }}{\partial \theta} (t,X^{\pi}_t)
        \] hence we obtain an analogue of the semi-gradient TD(0) algorithm.
\item Again using the martingale orthogonality condition with test process $\xi_t=\frac{\partial J^{\theta }}{\partial \theta } (t,X^{\pi}_t)$, but now choose $\theta \in \Theta $ via minimization of the generalized methods of moments (GMM) loss functional \[
                \frac{1}{2} \left( \frac{\partial J^{\theta }}{\partial \theta }(t,X^{\theta }_t)  \Delta M^{\theta }_t\right)^2
\] via SGD, which corresponds to GTD(0).
\


\subsection{Improvement: PG (policy evaluation in disguise)}
Having carried out the policy evaluation step to obtain the critic $J^{\theta }(t,x;\phi)$ estimating the true value function $J(t,x;\phi )$, we now look towards improving our estimation of the current policy via the policy gradient step. Let $g(t,x;\phi )\coloneqq \frac{\partial }{\partial \phi } J(t,x;\phi)$ denote the policy gradient. Provided $J$ is sufficiently regular (i.e. $C^{1,2}$), it is characterized as the unique solution of the Feynman-Kac formula \[
\begin{cases}
        \int_{A}^{} (\mathcal{L}^{a}J(t,x;\phi ) + r(t,x,a)+ \gamma H(\pi^{\phi }(a|t,x)) - \beta  J)  \pi(a|t,x)\,da =0\\
       J(T,x;\pi^{\phi })=g(x)
\end{cases}
\] and moreover, our assumptions on $b, \sigma, \pi$ imply $J(t,x;\phi )$ has polynomial growth in $x$. Differentiating in $\phi$ gives a new system of $N_{\phi }$ equations characterizing the policy gradient\[
\begin{cases}
\int_{A}^{}(\mathcal{L}^{a}g(t,x;\phi ) - \beta g(t,x;\phi )  + \widetilde{r}(t,x,a;\phi )) \pi^{\phi }(a|t,x) da=0\\
       g(T,x;\pi^{\phi })=0
\end{cases}
\] where \[
\widetilde{r}(t,x,a;\phi )\coloneqq \gamma  q(t,x,a) + (\mathcal{L}^{a}J(t,x;\phi ) + r(t,x,a)+ \gamma H(t,x,a) - \beta J(t,x;\phi))\frac{\partial }{\partial \phi }\log \pi(a|t,x)
.\] where $q(t,x,a)=\frac{\partial H}{\partial \phi}(t,x,a) $ Thus, Feynman-Kac implies that $g^{\phi}$ is uniquely characterized as the conditional expectation \[
g(t,x;\phi )=\EE_{t,x}^{\mathbf{P}}\left[ \int_{t}^{T}e^{-\beta (s-t)} \widetilde{r}(s,X^{\pi}_s,A^{\pi}_s;\phi )\,ds \right] 
\] i.e., $g$ is a value function with respect to a new reward $\widetilde{r}$, and hence estimating the policy gradient reduces to policy evaluation. In fact, this is easier then general PE as we only need to estimate the ``value function" $g(t,x;\phi )$ at the current state $X^{\phi }_t$, rather than estimating the entire function. 

We are not done however, as our reward $\widetilde{r}$ is defined in terms of the generator $\mathcal{L}^{a}J$, which is not observable and so we must re-characterize the policy gradient in a way which is amenable to learning from the environment. As always, the approach is use It\^o's lemma together with martingality. Namely, we have \[
d J(t,X^{a}_t;\phi ) = \mathcal{L}^{a}J(t,X^{a}_t) dt +d N_t^{a}
\] for some $(\mathcal{F}_t^{W},\mathbf{P}^{W})$-local martingale $N^{a}_t$. Thus, we can use a standard localization argument to get a true martingale which vanishes upon taking expectations provided we have sufficient regularity to pass to the limit. The following assumptions guarantee that such a technique will be possible.

\begin{assumption}\leavevmode
        \begin{enumerate}[1.]
                \item For all $\phi $, $\int_{\mathcal{A}}^{} |\widetilde{r}(t,x,a;\phi )| \pi^{\phi }(a|t,x)da$ is of polynomial growth in $x$ uniformly in $t$.
                \item For all $\phi $, \[
                \int_{\mathcal{A}}^{} \left|\frac{\partial }{\partial \phi } \log \pi^{\phi }(a|t,x)\right|^2 \pi^{\phi }(a|t,x) \,da
                \] is continuous in $(t,x)$.
        \
\end{assumption}

The above was intuition for the argument we will use, replacing $X^{a}_t$ with the true exploratory state process $X^{\phi }_t$.

\begin{thm}[Representation theorem for policy gradient]
       The policy gradient is given by \[
       g(t,x;\phi ) = \EE^{\mathbf{P}}_{t,x}\left[ \int_{t}^{T} e^{-\beta (s-t)} \left(\frac{\partial }{\partial \phi } \log \pi^{\phi }(A^{\pi}_s|s,X^{\phi }_s)e^{\beta s}dM_s^{\phi} + \gamma q(s,X^{\phi }_s,A^{\phi}_s)ds\right)  \right] 
\]  where $M_{t}^{\phi}$ is defined as in Equation \ref{PEmartingale} with $\pi=\pi^{\phi}$.
\end{thm}

\begin{proof}
       Define the exit times $\tau _{n}\coloneqq \inf \{t:|X^{\phi }_{t}| \geq n \} $. Applying It\^o's lemma to $J(s,X^{\phi }_s)$, we have 
       \begin{align*}
               &  \int_{t}^{T \wedge \tau _n} e^{-\beta (s-t)} \left(\frac{\partial }{\partial \phi } \log \pi^{\phi }(A^{\pi}_s|s,X^{\phi }_s)e^{\beta s}dM_s^{\phi} + \gamma q(s,X^{\phi }_s,A^{\phi}_s)ds\right) \\
               &= \int_{t}^{T \wedge \tau _n} e^{-\beta (s-t)} \left\{  \frac{\partial }{\partial \phi }  \log \pi^{\phi }(A^{\phi }_s | s, X^{\phi }_s) \left[\left(\mathcal{L}^{A^{\pi}_s}J(s,X^{\phi }_s) - \beta J(s,X^{\phi }_s) - J(s,X^{\phi }_s) + F(t,X^{\phi }_t,A^{\phi }_t)\right)ds\right.\right.\\ 
               &\left.\left. + \frac{\partial J}{\partial x} (s,X^{\phi }_s) \sigma(s,X^{\phi }_s,A^{\phi }_s) dW_s\right] + \gamma q(s,X^{\phi }_s,A^{\phi }_s)ds  \right\} 
       .\end{align*}

       We claim the It\^o integral is a true $(\mathcal{F}_t, \mathbf{P})$-martingale and hence its expectation vanishes. For $s \in [t, T \wedge \tau _n]$, we have the bound 
       \begin{align*}
               &\left| \int_{\mathcal{A}}\left(\frac{\partial }{\partial \phi } \log \pi^{\phi }(a|s,X^{\phi })_s \frac{\partial J}{\partial x} (s,X^{\phi }_s) \sigma(s,X^{\phi }_s,a)\right)\pi(a|s,X^{\phi }_s) da\right|^2 \\
               & \leq  
                \int_{\mathcal{A}}\left|\frac{\partial }{\partial \phi } \log \pi^{\phi }(a|s,X^{\phi }_s) \frac{\partial J}{\partial x} (s,X^{\phi }_s) \sigma(s,X^{\phi }_s,a)\right|^2\pi(a|s,X^{\phi }_s) da \tag{Jensen} \\ 
               & \leq C\int_{\mathcal{A}}\left|\frac{\partial }{\partial \phi } \log \pi^{\phi }(a|s,X^{\phi }_s) \frac{\partial J}{\partial x} (s,X^{\phi }_s)\right|^2\pi(a|s,X^{\phi }_s) da \tag{linear growth in $\sigma$} \\
               & \leq C \int_{\mathcal{A}}\left|\frac{\partial }{\partial \phi } \log \pi^{\phi }(a|s,X^{\phi }_s)\right|^2\pi(a|s,X^{\phi }_s) da \tag{continuity of $\frac{\partial J}{\partial \theta}$} \\
               & \leq C \tag{Assumption 3}
       \end{align*}
       where $C=C(n,\phi,T)$. Thus, taking expectations above and comparing terms, we see \begin{align*}
        &\EE^{\mathbf{P}}_{t,x}\left[\int_{t}^{T \wedge \tau _n} e^{-\beta (s-t)} \left(\frac{\partial }{\partial \phi } \log \pi^{\phi }(A^{\pi}_s|s,X^{\phi }_s)e^{\beta s}dM_s^{\phi} + \gamma q(s,X^{\phi }_s,A^{\phi}_s)ds\right)\right]\\
        &= \EE^{\mathbf{P}}_{t,x}  \left[ \int_{t}^{T \wedge \tau _n} e^{-\beta (s-t)}\widetilde{r}(s,X^{\phi }_s,A^{\phi }_s;\phi )\,ds \right] 
.\end{align*} 
Finally, it remains justify applying dominated convergence to take the limit $n \to \infty$ on both sides. For the right hand-side, we note \begin{align*}
        \EE^{\mathbf{P}^{W}}_{t,x}\left[\int_{t}^{T} e^{-\beta (s-t)}\int_{\mathcal{A}}^{} |\widetilde{r}(s,X^{\phi }_s,a;\phi )|\pi(a|s,X^{\phi }_s)\,dadt\right] & \leq C\EE^{\mathbf{P}^{W}}\left[1+\sup _{t \leq s \leq T}|X^{\phi }_s|^{\mu }|\right] \tag{Assumption 3}\\
                                                                                                                                         & \leq C (1+|x|^{\mu }) \tag{admissiblity of $\pi$}
.\end{align*}
\end{proof}

There are two takeaways from Theorem 2. Firstly, the first integrand in the policy gradient is precisely the log-likelihood of the current estimated policy scaled by the (continuous) TD error $dM^{\phi }_s$ of the true value function $J(t,x;\phi)$. Secondly, in order to estimate the policy gradient at time $t$ via Theorem 2, we require the entire sample trajectory $(X_s^{\phi },A^{\phi }_s)_{s \in [0,T]}$, hence we can only use this to produce offline algorithms. To derive online PG algorithms, we proceed analogously as in the case of PE. Namely, we would like to characterize the policy gradient via a martingale orthogonality condition. We can achieve this for the policy gradient at an optimal portfolio $\pi^{*}\coloneqq \pi^{\phi ^{*}}$ occurring at an interior point $\phi ^{*}\in \Phi \setminus \partial\Phi $. That is, assume $J(t,x;\phi^{*})$ is maximized at $\phi ^{*}$ for any $(x,t)$. Then the first-order-condition $g(0,x;\phi ^{*})=0$ combined with Feynman-Kac implies \begin{align*}
        0&=    \int_{\mathcal{A}}^{} \widetilde{r}(t,X^{*}_s,a;\phi ^{*})\pi^{\phi ^{*}}(a|t,x)da
.\end{align*} 
From this, together with the fact that we showed the local-martingale $N^{a}_t$ is a true martingale, we obtain the following in exactly the same way as Theorem \ref{thm1}.

\begin{thm}
       For every $(\mathcal{F}_t^{X^{*}}, \mathbf{P})$-progressively measurable bounded process $\eta$ and $x \in \mathbf{R}$, we have \[
       0 = \EE^{\mathbf{P}}_{x}\left[ \int_{0}^{T} \eta _s \left( \frac{\partial }{\partial \phi } \log \pi^{*}(A^{*}_s|s,X^{*}_s)d M^{*}_s + \gamma q(s,X^{*}_s,A^{*}_s)ds \right)   \right] 
       .\] 
\end{thm}

We use Theorems 2 and 3 in conjunction with Theorem 1 to design offline and online AC algorithms respectively.
\subsection{AC algorithms}
As in the discrete-time MDP setting, our AC algorithms consist of successive applications of policy evaluation and policy gradient. Having carried out the theoretical analysis of PE and PG in continuous time, we now discretize over a finite-sample grid $t_k=k\Delta t$ for $0 \leq k \leq \left\lfloor{T / \Delta t }\right\rfloor \eqqcolon K$.

We begin with an example of an offline algorithm. This is inherently episodic, with critic-actor parameters $(\theta , \phi )$ updated after a full trajectory (i.e. episode) $(X^{\pi}_{t_k}, A^{\pi}_{t_k})$ is sampled. We use the martingale orthogonality condition from Theorem 1 to carry out policy evaluation using a general test process $\xi_t$ which corresponds to different choices of algorithms. The policy improvement step is carried out using a discrete-time estimate of the policy gradient given by Theorem 2. For the online learning algorithm, we now update the critic using the martingale orthogonality condition after each time step $t_k$, rather than after sampling an entire state-action trajectory. We estimate the policy gradient using Theorem 3, taking a test function $\eta_{t_k}$ which satisfies $\eta_{t_k}=0$ for $t_k > t$ at time $t=t_{l}$, and again updating incrementally after each time step.
