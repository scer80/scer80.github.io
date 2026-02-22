---
layout: contents
---

# Learning Objective

## Marginal Flow Matching (ideal but intractable)

The natural objective is to regress a neural network $v_\theta$ directly onto the marginal vector field:

$$\mathcal{L}_{MFM}(\theta) = \mathbb{E}_{t,\, x_t} \left[ \| v_\theta(x_t, t) - v_t(x_t) \|^2 \right]$$

This is intractable: evaluating $v_t(x_t) = \mathbb{E}_{p_t(z \mid x_t)}[v_t(x_t \mid z)]$ requires integrating over the full data distribution.

## Conditional Flow Matching (practical)

Instead, we regress onto the *conditional* vector field. Sample a data point $x_1 \sim p_{data}$, noise $x_0 \sim p_0$, time $t \sim \text{Uniform}(0,1)$, and form $x_t = (1-t)x_0 + t x_1$:

$$\mathcal{L}_{CFM}(\theta) = \mathbb{E}_{t,\, x_0,\, x_1} \left[ \| v_\theta(x_t, t) - \underbrace{(x_1 - x_0)}_{v_t(x_t | x_1)} \|^2 \right]$$

## Why CFM works: equivalence of minimizers

The two objectives have the same minimizer. For any squared-error objective:

$$\arg\min_f \mathbb{E}\left[\|f(x) - y\|^2\right] = \mathbb{E}[y \mid x]$$

**Proof.** By the law of total expectation:

$$\mathbb{E}[\|f(x) - y\|^2] = \mathbb{E}_x\big[\mathbb{E}_{y \mid x}[\|f(x) - y\|^2]\big]$$

We can minimize pointwise for each $x$. Setting $c = f(x)$:

$$\mathbb{E}_{y \mid x}[\|c - y\|^2] = \|c\|^2 - 2c \cdot \mathbb{E}[y \mid x] + \mathbb{E}[\|y\|^2|x]$$

Differentiating w.r.t. $c$:

$2c - 2\mathbb{E}[y \mid x] = 0$, so $f^*(x) = \mathbb{E}[y \mid x]$. $\square$

Applied here: the minimizer of $\mathcal{L}_{CFM}$ predicts

$$\mathbb{E}[v_t(x_t \mid x_1) \mid x_t] = \mathbb{E}_{p_t(x_1 \mid x_t)}[v_t(x_t \mid x_1)] = v_t(x_t)$$

So training on the easy conditional objective recovers the intractable marginal vector field.
