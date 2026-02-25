---
layout: contents
---

# DDIM and ODE-SDE Equivalence

DDIM is best understood as a **sampler choice** inside the ODE/SDE-equivalent family from [Equivalence Theorem](../ode_sde_equivalence/equivalence_theorem.md) and [Inversion Commutativity](../ode_sde_equivalence/equivalence_inversion_commutativity.md).

## Same Training as DDPM

DDIM uses the same forward process and training target as DDPM:

$$x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\epsilon,\qquad \epsilon\sim\mathcal N(0,I)$$

with noise-prediction objective

$$\min_\theta \mathbb E\left[\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2\right].$$

No DDIM-specific retraining is required.

## Where DDIM Sits in the Equivalence

From the equivalence theorem, for a probability path $p_t$ and base transport field $u_t$, the forward SDE family is

$$dx=\left[u_t(x)+\frac{\sigma_t^2}{2}\nabla\log p_t(x)\right]dt+\sigma_t\,dW_t.$$

From inversion commutativity, the corresponding reverse-time family (written in forward-time coordinates) is

$$dx=\left[u_t(x)-\frac{\sigma_t^2}{2}\nabla\log p_t(x)\right]dt+\sigma_t\,d\bar W_t. \tag{*}$$

Equation (*) is the key DDPM/DDIM bridge:

- If $\sigma_t>0$, sampling is stochastic (DDPM-like reverse SDE behavior).
- If $\sigma_t=0$, it becomes deterministic:
$$dx=u_t(x)\,dt,$$
which is the probability-flow ODE limit.

DDIM is this deterministic limit in discrete-time form (or a partially stochastic interpolation via $\eta$ in the DDIM paper).

## Discrete DDIM Step (Deterministic)

Given $\epsilon_\theta(x_t,t)$, define
$$\hat x_0=\frac{x_t-\sigma_t\epsilon_\theta(x_t,t)}{\alpha_t}.$$

For a step to an earlier time $s<t$, DDIM ($\eta=0$) uses
$$x_s=\alpha_s\hat x_0+\sigma_s\,\epsilon_\theta(x_t,t),$$
with no extra Gaussian noise term.

So DDIM and DDPM share the same learned model; they differ only in which member of the equivalent reverse dynamics family is used at sampling time.
