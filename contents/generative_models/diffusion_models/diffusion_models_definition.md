---
layout: contents
---

# Diffusion Models

## The Gaussian Probability Path

Diffusion models define a conditional probability path between data and noise via:

$$x_t = \alpha_t x_0 + \sigma_t \epsilon, \quad \epsilon \sim \mathcal{N}(0, I) \tag{1}$$

where $\alpha_t$ and $\sigma_t$ are the noise schedule with $\alpha_0 = 1,\; \sigma_0 = 0$ at the data end and $\alpha_1 = 0,\; \sigma_1 = 1$ at the noise end. This gives $p_t(x \mid x_0) = \mathcal{N}(x;\, \alpha_t x_0,\, \sigma_t^2 I)$.

We want a linear SDE $dx = f(t)\,x\,dt + g(t)\,dW_t$ whose transition density matches $p_t(x \mid x_0) = \mathcal{N}(\alpha_t x_0,\, \sigma_t^2 I)$. For a linear SDE, the conditional mean $m_t = \mathbb{E}[x_t \mid x_0]$ and variance $v_t = \text{Var}(x_t \mid x_0)$ satisfy:

$$\dot{m}_t = f(t)\,m_t, \qquad \dot{v}_t = 2f(t)\,v_t + g^2(t)$$

**Matching the mean** ($m_t = \alpha_t x_0$, $m_0 = x_0$): $\dot{\alpha}_t x_0 = f(t)\,\alpha_t x_0$, giving $f(t) = \frac{\dot{\alpha}_t}{\alpha_t}$.

**Matching the variance** ($v_t = \sigma_t^2$, $v_0 = 0$): $2\sigma_t\dot{\sigma}_t = 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2 + g^2(t)$, giving $g^2(t) = 2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2$.

The **noising SDE** is therefore:

$$dx = \underbrace{\frac{\dot{\alpha}_t}{\alpha_t}\,x}_{f(x,t)}\,dt + \underbrace{\sqrt{2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2}}_{g(t)}\,dW_t \tag{2}$$

This derivation assumes $\alpha_t,\sigma_t$ are differentiable and $\alpha_t \neq 0$ on the open interval where (2) is used (typically $t \in [0,1)$). At the endpoint $t=1$, $\alpha_1=0$ is handled as a limit.

## The Conditional Velocity

Differentiating the path w.r.t. $t$:

$$v_t(x_t \mid x_0) = \frac{dx_t}{dt} = \dot{\alpha}_t x_0 + \dot{\sigma}_t \epsilon$$

The marginal vector field follows by marginalization:

$$v_t(x_t) = \mathbb{E}_{p_t(x_0 \mid x_t)}[v_t(x_t \mid x_0)]$$

## Prediction Targets (Reparameterization)

From the path equation, $\epsilon = \frac{x_t - \alpha_t x_0}{\sigma_t}$, so:

$$v_t(x_t \mid x_0) = \dot{\alpha}_t x_0 + \dot{\sigma}_t \cdot \frac{x_t - \alpha_t x_0}{\sigma_t} = \frac{\dot{\sigma}_t}{\sigma_t} x_t + \left(\dot{\alpha}_t - \frac{\alpha_t \dot{\sigma}_t}{\sigma_t}\right) x_0$$

A network predicting any one of $\epsilon$, $x_0$, or $v_t$ can compute the other two given $x_t$ and $t$:

| Prediction target | Notation | Relationship |
| :--- | :--- | :--- |
| **Noise** | $\epsilon_\theta(x_t, t)$ | $\epsilon = \frac{x_t - \alpha_t x_0}{\sigma_t}$ |
| **Data** | $\hat{x}\_{0,\theta}(x_t, t)$ | $x_0 = \frac{x_t - \sigma_t \epsilon}{\alpha_t}$ |
| **Velocity** | $v_\theta(x_t, t)$ | $v_t = \dot{\alpha}_t x_0 + \dot{\sigma}_t \epsilon$ |

These are all linear functions of each other given $(x_t, t)$. In the idealized Gaussian path setting, objectives based on predicting noise/data/velocity are equivalent up to a time-dependent weighting; practical implementations can differ due to parameterization and loss weighting choices.

## Original DDPM Training Target

In the original DDPM paper (Ho et al., 2020), the model is trained to predict the additive Gaussian noise at a randomly sampled discrete timestep:

$$x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon, \quad \epsilon \sim \mathcal{N}(0,I)$$

with network output $\epsilon_\theta(x_t,t)$. The commonly used simplified objective is:

$$L_{\text{simple}} = \mathbb{E}_{t,x_0,\epsilon}\left[\left\|\epsilon - \epsilon_\theta(x_t,t)\right\|_2^2\right]$$

This is a reweighted form of the variational bound terms and became the standard DDPM training target in practice.
