---
layout: contents
---


# Diffusion SDE

## Wiener Process and Ito Calculus

Wiener process SDE: $dx=f(x(t),t)dt+g(x(t), t)dW$.

- $dW$ is a Wiener process or Brownian motion
    *   $W_0 = 0$ (it starts at zero).
    *   It has **stationary and independent increments**: This means that the change in the process over any time interval ($W_{t+\Delta t} - W_t$) is independent of past changes and depends only on the length of the interval $\Delta t$, not on $t$ itself.
    *   The increments are **normally distributed**: Specifically, $W_{t+\Delta t} - W_t$ follows a normal distribution with mean 0 and variance $\Delta t$. So, $dW_t$ represents a random "kick" at each instant, drawn from a normal distribution with variance $dt$.
- in Ito calculus, the variance of the increment $dW_t$ is exactly $dt$, i.e. $(dW_t)^2 = dt$
- **Ito's Insight: Ito's Lemma**: This is the heart of Ito calculus. If you have a function $F(x, t)$ where $x$ follows an SDE like yours, and you want to find $dF$, you can't just use the standard chain rule. 
    * $dx_t = \mu_t dt + \sigma_t dW_t$ and $F(x_t, t)$ is a twice-differentiable function, then Ito's Lemma states:
    * $dF = \left( \frac{\partial F}{\partial t} + \mu_t \frac{\partial F}{\partial x} + \frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2} \right) dt + \sigma_t \frac{\partial F}{\partial x} dW_t$

    See that $\frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2}$ term? That's the special Ito correction that comes from $(dW_t)^2 = dt$. It accounts for the non-differentiability and high volatility of the Wiener process.

## Fokker-Planck Equation for the Wiener Process

We connect the SDE $dx = f(x,t)\,dt + g(x,t)\,dW_t$ to the Kramers-Moyal / Fokker-Planck machinery (see [Fokker-Planck derivation](fokker_planck.md)).

### Short-time transition density $p(y, \Delta t \mid x)$

Over a small interval $\Delta t$, starting at $x$, the SDE gives:

$$y = x + f(x)\,\Delta t + g(x)\,\sqrt{\Delta t}\;\xi, \qquad \xi \sim \mathcal{N}(0,1)$$

So $y \mid x$ is Gaussian with mean $x + f\Delta t$ and variance $g^2 \Delta t$:

$$p(y, \Delta t \mid x) = \frac{1}{\sqrt{2\pi\, g(x)^2\, \Delta t}}\;\exp\!\left(-\frac{\big(y - x - f(x)\,\Delta t\big)^2}{2\,g(x)^2\,\Delta t}\right)$$

### Computing the Kramers-Moyal coefficients $D_n$

Recall: $D_n(x) = \frac{1}{n!}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\int (y-x)^n\, p(y, \Delta t \mid x)\, dy = \frac{1}{n!}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}[(y-x)^n]$.

From the transition density above, $y - x = f\,\Delta t + g\,\sqrt{\Delta t}\;\xi$, so all moments reduce to Gaussian moments of $\xi$.

**$D_1$ (drift):**

$$D_1 = \lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}\big[f\,\Delta t + g\sqrt{\Delta t}\;\xi\big] = \lim_{\Delta t \to 0}\frac{1}{\Delta t}\big[f\,\Delta t + 0\big] = f(x)$$

**$D_2$ (diffusion):**

$$D_2 = \frac{1}{2}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}\big[(f\,\Delta t + g\sqrt{\Delta t}\;\xi)^2\big]$$

Expand the square:

$$= \frac{1}{2}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\Big[\underbrace{f^2(\Delta t)^2}_{\to 0} + \underbrace{2fg\,(\Delta t)^{3/2}\,\mathbb{E}[\xi]}_{=0} + g^2\,\Delta t\,\underbrace{\mathbb{E}[\xi^2]}_{=1}\Big] = \frac{1}{2}g(x)^2$$

### $D_n$ for $n > 2$: exactly zero, not merely neglected

Expand $(y-x)^n = (f\,\Delta t + g\sqrt{\Delta t}\;\xi)^n$ by the binomial theorem. A generic term is:

$$\binom{n}{k}(f\,\Delta t)^{n-k}(g\sqrt{\Delta t})^k\,\xi^k$$

which carries a factor $(\Delta t)^{n - k/2}$. After dividing by $\Delta t$ (as in the $D_n$ definition), the power of $\Delta t$ is $n - k/2 - 1$. For this to survive $\Delta t \to 0$, we need:

$$n - k/2 - 1 \leq 0 \quad\Longrightarrow\quad k \geq 2(n-1)$$

But $k \leq n$, so we need $2(n-1) \leq n$, i.e. $n \leq 2$.

**Therefore $D_n = 0$ exactly for all $n > 2$.** The Fokker-Planck equation is **not** a truncation of the Kramers-Moyal expansion — it is the exact, complete description for any Ito SDE driven by Gaussian noise.

### The Fokker-Planck equation

Substituting $D_1 = f$ and $D_2 = \tfrac{1}{2}g^2$ into the Kramers-Moyal expansion:

$$\frac{\partial p(y, t \mid x)}{\partial t} = -\frac{\partial}{\partial y}\big[f(y)\, p(y,t \mid x)\big] + \frac{1}{2}\frac{\partial^2}{\partial y^2}\big[g(y)^2\, p(y,t \mid x)\big]$$

## Mean & Variance Dynamical Equations

For a linear SDE $dx = f(t)\,x\,dt + g(t)\,dW_t$ (drift linear in $x$, diffusion depending only on $t$), the conditional mean $m_t = \mathbb{E}[x_t \mid x_0]$ and variance $v_t = \text{Var}(x_t \mid x_0)$ satisfy closed-form ODEs.

### Mean: $\dot{m}_t = f(t)\,m_t$

Take expectations of the SDE. Since $\mathbb{E}[dW_t] = 0$:

$$dm_t = \mathbb{E}[f(t)\,x_t\,dt + g(t)\,dW_t] = f(t)\,m_t\,dt$$

$$\boxed{\dot{m}_t = f(t)\,m_t}, \qquad m_0 = x_0$$

with solution $m_t = e^{\int_0^t f(s)\,ds}\, x_0$.

### Variance: $\dot{v}_t = 2f(t)\,v_t + g^2(t)$

Apply Ito's lemma to $F(x) = x^2$, with $F' = 2x$ and $F'' = 2$:

$$d(x_t^2) = \left(2x_t \cdot f(t)\,x_t + \tfrac{1}{2} \cdot 2 \cdot g^2(t)\right)dt + 2x_t\,g(t)\,dW_t$$

Take expectations (the $dW_t$ term vanishes):

$$\frac{d}{dt}\mathbb{E}[x_t^2] = 2f(t)\,\mathbb{E}[x_t^2] + g^2(t)$$

Since $v_t = \mathbb{E}[x_t^2] - m_t^2$:

$$\dot{v}_t = \frac{d}{dt}\mathbb{E}[x_t^2] - 2m_t\dot{m}_t = 2f(t)\,\mathbb{E}[x_t^2] + g^2(t) - 2f(t)\,m_t^2 = 2f(t)\,v_t + g^2(t)$$

$$\boxed{\dot{v}_t = 2f(t)\,v_t + g^2(t)}, \qquad v_0 = 0$$

These two ODEs fully determine the Gaussian transition kernel of the linear SDE: $p_t(x \mid x_0) = \mathcal{N}(m_t,\, v_t)$. They are used in [Diffusion models](diffusion_models.md) to derive the noising SDE from a prescribed noise schedule.

## Paths, differentiability, and the meaning of the SDE

### Individual paths are continuous but nowhere differentiable

A Wiener process $W_t$ is almost surely continuous — sample paths $t \mapsto W_t$ are well-defined continuous curves. The same holds for solutions $X_t$ of an SDE: each realization is a continuous function of time.

However, these paths are **nowhere differentiable**. In an ODE, decreasing $\Delta t$ makes the ratio $\Delta X / \Delta t$ converge to the derivative $dX/dt$. In an SDE, the stochastic increment $g\,\sqrt{\Delta t}\;\xi$ contributes a term $g\,\xi / \sqrt{\Delta t}$ to that ratio, which **diverges** as $\Delta t \to 0$. No pointwise derivative exists at any $t$.

### The SDE is shorthand for an integral equation

Because paths are not differentiable, the notation $dX = f\,dt + g\,dW$ is not a differential equation in the classical sense. It is shorthand for the **integral equation**:

$$X_t = X_0 + \int_0^t f(X_s, s)\,ds + \int_0^t g(X_s, s)\,dW_s$$

The first integral is an ordinary Riemann integral. The second is the **Ito integral**, defined as a mean-square limit of sums over discretizations:

$$\int_0^t g\,dW_s = \lim_{n\to\infty} \sum_i g(X_{t_i}, t_i)\,(W_{t_{i+1}} - W_{t_i})$$

This limit converges in $L^2$ (mean-square), not pointwise. Individual paths are therefore constructed through integration, never through differentiation.

### Convergence lives at the distribution level

While $\Delta X / \Delta t$ has no pointwise limit, the $\Delta t \to 0$ limit is well-defined when taken over **moments of the transition density**. This is exactly what the Kramers-Moyal coefficients capture:

$$D_n(x) = \frac{1}{n!}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}[(y-x)^n]$$

The $1/\Delta t$ factor that would blow up for a single realization is tamed by the expectation $\mathbb{E}[\cdot]$, which averages over the noise. The result is the Fokker-Planck equation — an evolution equation for the probability density $p(y,t \mid x)$ that admits a genuine time derivative $\partial_t p$.

### Summary of the three levels

| Level | Object | Well-defined? |
|---|---|---|
| Single path $X_t$ | Continuous curve | Yes — continuous, but nowhere differentiable. No $dX/dt$. |
| SDE $dX = f\,dt + g\,dW$ | Integral equation for paths | Yes — via the Ito integral (mean-square limit). |
| Fokker-Planck $\partial_t p = \ldots$ | PDE for the density | Yes — smooth $\partial_t p$ exists. Clean calculus applies. |

The roughness of individual paths is not an artifact of discretization — it is intrinsic to Brownian motion. The SDE framework handles this by shifting from pointwise derivatives to integrals (at the path level) and to density evolution (at the population level).
