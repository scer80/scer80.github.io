---
layout: contents
---

# Diffusion Models

## The Gaussian Probability Noising Path

Diffusion models define a conditional probability path between data and noise via:

$$x_t = \alpha_t x_0 + \sigma_t \epsilon, \quad \epsilon \sim \mathcal{N}(0, I) \tag{1}$$

where $\alpha_t$ and $\sigma_t$ are the noise schedule with $\alpha_0 = 1,\; \sigma_0 = 0$ at the data end and $\alpha_1 = 0,\; \sigma_1 = 1$ at the noise end. This gives $p_t(x \mid x_0) = \mathcal{N}(x;\, \alpha_t x_0,\, \sigma_t^2 I)$.

## The Noising SDE

We want a linear SDE $dx = f(t)\,x\,dt + g(t)\,dW_t$ whose transition density matches $p_t(x \mid x_0) = \mathcal{N}(\alpha_t x_0,\, \sigma_t^2 I)$. For a linear SDE, the conditional mean $m_t = \mathbb{E}[x_t \mid x_0]$ and variance $v_t = \text{Var}(x_t \mid x_0)$ satisfy:

$$\dot{m}_t = f(t)\,m_t, \qquad \dot{v}_t = 2f(t)\,v_t + g^2(t)$$

**Matching the mean** ($m_t = \alpha_t x_0$, $m_0 = x_0$): $\dot{\alpha}_t x_0 = f(t)\,\alpha_t x_0$, giving $f(t) = \frac{\dot{\alpha}_t}{\alpha_t}$.

**Matching the variance** ($v_t = \sigma_t^2$, $v_0 = 0$): $2\sigma_t\dot{\sigma}_t = 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2 + g^2(t)$, giving $g^2(t) = 2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2$.

The **noising SDE** is therefore:

$$dx = \underbrace{\frac{\dot{\alpha}_t}{\alpha_t}\,x}_{f(x,t)}\,dt + \underbrace{\sqrt{2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2}}_{g(t)}\,dW_t \tag{2}$$

This derivation assumes $\alpha_t,\sigma_t$ are differentiable and $\alpha_t \neq 0$ on the open interval where (2) is used (typically $t \in [0,1)$). At the endpoint $t=1$, $\alpha_1=0$ is handled as a limit.

## Reversing the Noising SDE

The forward SDE defines a density path $p_t$. In generation, we solve the reverse-time dynamics from noise to data.

Using the ODE/SDE equivalence viewpoint, a reverse family with the same probability path can be written (in forward-time coordinates) as

$$dx = \left[u_t(x) - \frac{\sigma_t^2}{2}\nabla \log p_t(x)\right]dt + \sigma_t\,d\bar W_t.$$

This shows what must be known to sample: the drift component involving the score $\nabla \log p_t(x)$ (equivalently, the denoising direction).

## Learning the Drift Factor of the Denoising SDE

Models do not learn $\nabla \log p_t$ directly in most implementations. Instead they learn an equivalent target (noise, data, or velocity), and this determines the reverse drift.

For the Gaussian path
$$x_t = \alpha_t x_0 + \sigma_t \epsilon,$$
the conditional velocity is
$$v_t(x_t\mid x_0)=\dot\alpha_t x_0+\dot\sigma_t\epsilon.$$

The marginal drift field is then
$$v_t(x)=\mathbb E_{p_t(x_0\mid x)}[v_t(x\mid x_0)],$$
which is another equivalent parameterization of the denoising dynamics.

### Explicit Score Connection

From $x_t=\alpha_t x_0+\sigma_t\epsilon$, we have
$$x_0\mid x_t \sim \text{(posterior induced by data prior)}, \qquad
\nabla\log p_t(x_t)=-\frac{1}{\sigma_t}\,\mathbb E[\epsilon\mid x_t].$$

So with an $\epsilon$-predictor,
$$\nabla\log p_t(x_t)\approx -\frac{1}{\sigma_t}\,\epsilon_\theta(x_t,t).$$

Using $\hat x_{0,\theta}$ instead:
$$\epsilon_\theta(x_t,t)=\frac{x_t-\alpha_t\hat x_{0,\theta}(x_t,t)}{\sigma_t}
\;\Rightarrow\;
\nabla\log p_t(x_t)\approx -\frac{x_t-\alpha_t\hat x_{0,\theta}(x_t,t)}{\sigma_t^2}.$$

Using $v_\theta$:
$$v_\theta=\dot\alpha_t \hat x_{0,\theta}+\dot\sigma_t \epsilon_\theta,$$
then convert to $\epsilon_\theta$ (or $\hat x_{0,\theta}$) and apply the same score formula.

This is why predicting $\epsilon$, $x_0$, or $v$ still gives the score term needed in the reverse drift.

## Equivalence of Targets: $\epsilon$, $x_0$, and $v$

From $\epsilon = \frac{x_t-\alpha_t x_0}{\sigma_t}$,
$$v_t(x_t\mid x_0)=\frac{\dot{\sigma}_t}{\sigma_t}x_t+\left(\dot{\alpha}_t-\frac{\alpha_t\dot{\sigma}_t}{\sigma_t}\right)x_0.$$

So predicting any one of $\epsilon$, $x_0$, or $v_t$ determines the others given $(x_t,t)$:

| Prediction target | Notation | Relationship |
| :--- | :--- | :--- |
| **Noise** | $\epsilon_\theta(x_t, t)$ | $\epsilon = \frac{x_t - \alpha_t x_0}{\sigma_t}$ |
| **Data** | $\hat{x}\_{0,\theta}(x_t, t)$ | $x_0 = \frac{x_t - \sigma_t \epsilon}{\alpha_t}$ |
| **Velocity** | $v_\theta(x_t, t)$ | $v_t = \dot{\alpha}_t x_0 + \dot{\sigma}_t \epsilon$ |

In the Gaussian-path setting, these objectives are equivalent up to time-dependent weighting.

## Diffusion in Practice (DDPM)

DDPM uses the same forward noising process, and trains a network to predict noise:

$$x_t = \sqrt{\bar{\alpha}_t}x_0 + \sqrt{1-\bar{\alpha}_t}\epsilon,\qquad \epsilon\sim\mathcal N(0,I),$$
$$L_{\text{simple}}=\mathbb E_{t,x_0,\epsilon}\left[\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2\right].$$

So practically: DDPM learns an equivalent denoising target, then uses it to instantiate a reverse-time sampler.
