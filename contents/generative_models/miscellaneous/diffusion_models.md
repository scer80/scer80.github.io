---
layout: contents
---

# Diffusion Models

## The Gaussian Probability Path

Diffusion models define a conditional probability path between data and noise via:

$$x_t = \alpha_t x_0 + \sigma_t \epsilon, \quad \epsilon \sim \mathcal{N}(0, I) \tag{1}$$

where $\alpha_t$ and $\sigma_t$ are the noise schedule with $\alpha_0 = 1,\; \sigma_0 = 0$ at the data end and $\alpha_1 = 0,\; \sigma_1 = 1$ at the noise end. This gives $p_t(x \mid x_0) = \mathcal{N}(x;\, \alpha_t x_0,\, \sigma_t^2 I)$.

**Noising** (forward process) transitions from $p_0(x) = p_\text{data}(x)$ to $p_1(x) = \mathcal{N}(0, I)$: $t$ increases from 0 to 1. This directly corresponds to the forward process in [Diffusion inversion](diffusion_inversion.md) (with $T = 1$).

We want a linear SDE $dx = f(t)\,x\,dt + g(t)\,dW_t$ whose transition density matches $p_t(x \mid x_0) = \mathcal{N}(\alpha_t x_0,\, \sigma_t^2 I)$. For a linear SDE, the conditional mean $m_t = \mathbb{E}[x_t \mid x_0]$ and variance $v_t = \text{Var}(x_t \mid x_0)$ satisfy:

$$\dot{m}_t = f(t)\,m_t, \qquad \dot{v}_t = 2f(t)\,v_t + g^2(t)$$

**Matching the mean** ($m_t = \alpha_t x_0$, $m_0 = x_0$): $\dot{\alpha}_t x_0 = f(t)\,\alpha_t x_0$, giving $f(t) = \frac{\dot{\alpha}_t}{\alpha_t}$.

**Matching the variance** ($v_t = \sigma_t^2$, $v_0 = 0$): $2\sigma_t\dot{\sigma}_t = 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2 + g^2(t)$, giving $g^2(t) = 2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2$.

The **noising SDE** is therefore:

$$dx = \underbrace{\frac{\dot{\alpha}_t}{\alpha_t}\,x}_{f(x,t)}\,dt + \underbrace{\sqrt{2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2}}_{g(t)}\,dW_t \tag{2}$$

**Denoising** (reverse process) goes from noise ($t=1$) back to data ($t=0$). Define reverse time $u = 1 - t$ running from 0 to 1, and reverse density $q_u(x) = p_{1-u}(x)$, consistent with [Diffusion inversion](diffusion_inversion.md) (with $T = 1$).

**Step 1: Denoising SDE by Direct Inversion.** Inverting the noising SDE (2) using the [reverse-time drift](diffusion_inversion.md) gives a reverse SDE with the **same** diffusion coefficient $g(1-u)$:

$$dx(u) = \left[-\frac{\dot{\alpha}_{1-u}}{\alpha_{1-u}}\,x + g^2(1-u)\, \frac{\partial}{\partial x}\log q_u(x)\right] du + g(1-u)\, dW_u \tag{3}$$

The noise schedule is not free — it is determined by the forward SDE.

**Step 2: Noising ODE**

The noising SDE (2) and the noising ODE $\frac{dx}{dt} = v_t(x)$ generate the same density path $p_t$ (by [ODE-SDE equivalence](ode_sde_equivalence.md)), where $v_t$ is the marginal velocity (see below). Inverting the ODE gives the denoising ODE:

$$\frac{dx(t)}{dt} = f(x,t) - \frac{1}{2}g^2(t) \nabla_x \log p_t$$
$$\frac{dx(t)}{dt} = \frac{\dot{\alpha}_t}{\alpha_t}\,x - \frac{1}{2}\left(2\sigma_t\dot{\sigma}_t - 2\frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2\right) \nabla_x \log p_t$$
$$\frac{dx(t)}{dt} = \frac{\dot{\alpha}_t}{\alpha_t}\,x - \left(\sigma_t\dot{\sigma}_t - \frac{\dot{\alpha}_t}{\alpha_t}\sigma_t^2\right) \nabla_x \log p_t \tag{4}$$

**Step 3: Denoising ODE**

Direct inversion of the noising ODE gives a denoising ODE with the **same** drift:
$$\frac{dx(u)}{du} = -\frac{\dot{\alpha}_{1-u}}{\alpha_{1-u}}\,x + \left(\sigma_{1-u}\dot{\sigma}_{1-u} - \frac{\dot{\alpha}_{1-u}}{\alpha_{1-u}}\sigma_{1-u}^2\right) \nabla_x \log q_u(x) \tag{5}$$

By ODE-SDE equivalence, we can also construct a family of denoising SDEs with any sampler noise $s_u \geq 0$:

$$dx(u) = \left[-\frac{\dot{\alpha}_{1-u}}{\alpha_{1-u}}\,x + \left(\sigma_{1-u}\dot{\sigma}_{1-u} - \frac{\dot{\alpha}_{1-u}}{\alpha_{1-u}}\sigma_{1-u}^2\right) \frac{\partial}{\partial x}\log q_u(x) + \frac{s_u^2}{2} \frac{\partial}{\partial x}\log q_u(x)\right] du + s_u\, dW_u$$

**Step 2: Probability flow ODE.** The noising SDE (2) and the noising ODE $\frac{dx}{dt} = v_t(x)$ generate the same density path $p_t$ (by [ODE-SDE equivalence](ode_sde_equivalence.md)), where $v_t$ is the marginal velocity (see below). Inverting the ODE gives the denoising ODE:

$$\frac{dx(u)}{du} = -v_{1-u}(x) \tag{4}$$

**Step 3: Free noise via ODE-SDE equivalence.** Since (4) generates $q_u$, we can apply [ODE-SDE equivalence](ode_sde_equivalence.md) to construct a family of denoising SDEs with any sampler noise $s_u \geq 0$:

$$dx(u) = \left[-v_{1-u}(x) + \frac{s_u^2}{2} \frac{\partial}{\partial x}\log q_u(x)\right] du + s_u\, dW_u \tag{5}$$

Setting $s_u = 0$ recovers the deterministic ODE (4). Setting $s_u = g(1-u)$ recovers the direct SDE inversion (3). Any other $s_u$ generates the same density $q_u$ with different stochastic trajectories.

This path is **curved** in general, since $\alpha_t$ and $\sigma_t$ need not be linear in $t$.


One ODE → many SDEs: Yes. Given one ODE transporting $p_0 \to p_1$, you get a whole family of SDEs parameterized by $\sigma_t \geq 0$, all sharing the same marginal path $p_t$.

  One SDE → one ODE: Yes. The probability flow ODE is unique for a given SDE.

  Is that ODE DDIM?: Yes — DDIM is exactly the probability flow ODE of the DDPM diffusion SDE.

  Is DDIM Flow Matching?: Almost, but not quite. They're both ODE-based transport from $p_0$ to $p_1$, but they differ in generality and training:

  - DDIM is a specific probability flow ODE, derived from the DDPM SDE. The vector field is expressed via the score $\nabla \log p_t$, learned through denoising score matching.
  - Flow Matching directly learns a vector field $u_t$ defining an ODE, without going through an SDE or score function. It can use any conditional paths (e.g., optimal transport
  straight-line paths), not just the Gaussian diffusion paths that DDPM uses.

  So DDIM is a special case — it's one particular flow (ODE transport) that happens to come from a diffusion SDE. Flow Matching is the broader framework. When Flow Matching uses the same
  Gaussian conditional paths as DDPM, it recovers equivalent dynamics to DDIM, but it can also do things DDIM can't (like OT paths).

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

These are all linear functions of each other given $(x_t, t)$. The training objectives (noise prediction, velocity prediction) differ only by a time-dependent reweighting.

## Sampling: SDE vs. ODE (DDIM)

The denoising SDE (5) with $s_u > 0$ gives stochastic sampling. **DDIM** is the $s_u = 0$ case — the deterministic ODE (4). DDIM was the first practical demonstration that diffusion models contain a deterministic flow, an instance of [ODE-SDE equivalence](ode_sde_equivalence.md).
