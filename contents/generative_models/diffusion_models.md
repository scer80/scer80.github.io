---
layout: contents
---

# Diffusion Models

## The Gaussian Probability Path

Diffusion models define a conditional probability path between data and noise via:

$$x_t = \alpha_t x_1 + \sigma_t \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)$$

where $\alpha_t$ and $\sigma_t$ are the noise schedule (with $\alpha_0 = 0,\; \sigma_0 = 1$ at the noise end and $\alpha_1 = 1,\; \sigma_1 = 0$ at the data end). This means $p_t(x \mid x_1) = \mathcal{N}(x;\, \alpha_t x_1,\, \sigma_t^2 I)$.

This path is **curved** in general, since $\alpha_t$ and $\sigma_t$ need not be linear in $t$.

## The Conditional Velocity

Differentiating the path w.r.t. $t$:

$$v_t(x_t \mid x_1) = \frac{dx_t}{dt} = \dot{\alpha}_t x_1 + \dot{\sigma}_t \epsilon$$

The marginal vector field follows by marginalization:

$$v_t(x_t) = \mathbb{E}_{p_t(x_1 \mid x_t)}[v_t(x_t \mid x_1)]$$

## Prediction Targets (Reparameterization)

From the path equation, $\epsilon = \frac{x_t - \alpha_t x_1}{\sigma_t}$, so:

$$v_t(x_t \mid x_1) = \dot{\alpha}_t x_1 + \dot{\sigma}_t \cdot \frac{x_t - \alpha_t x_1}{\sigma_t} = \frac{\dot{\sigma}_t}{\sigma_t} x_t + \left(\dot{\alpha}_t - \frac{\alpha_t \dot{\sigma}_t}{\sigma_t}\right) x_1$$

A network predicting any one of $\epsilon$, $x_1$, or $v_t$ can compute the other two given $x_t$ and $t$:

| Prediction target | Notation | Relationship |
| :--- | :--- | :--- |
| **Noise** | $\epsilon_\theta(x_t, t)$ | $\epsilon = \frac{x_t - \alpha_t x_1}{\sigma_t}$ |
| **Data** | $\hat{x}\_{1,\theta}(x_t, t)$ | $x_1 = \frac{x_t - \sigma_t \epsilon}{\alpha_t}$ |
| **Velocity** | $v_\theta(x_t, t)$ | $v_t = \dot{\alpha}_t x_1 + \dot{\sigma}_t \epsilon$ |

These are all linear functions of each other given $(x_t, t)$. The training objectives (noise prediction, velocity prediction) differ only by a time-dependent reweighting.

## Sampling: SDE vs. ODE (DDIM)

Diffusion models are typically formulated as **SDEs** — the noise $\sigma_t dW_t$ in the reverse process gives stochastic sampling.

**DDIM** ($\eta = 0$) is the insight that you can instead sample via a **deterministic ODE**:

$$\frac{dx_t}{dt} = v_t(x_t)$$

This is possible because of the [ODE-SDE equivalence](ode_sde_equivalence.md): for any SDE generating a probability path $p_t$, there exists a deterministic ODE generating the same path. DDIM was the first practical demonstration that diffusion models contain a deterministic flow.
