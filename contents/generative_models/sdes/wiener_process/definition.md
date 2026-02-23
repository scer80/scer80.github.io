---
layout: contents
---

# Wiener Process and Ito Calculus

## Wiener Process SDE

Wiener process SDE: $dx = f(x(t),t)dt + g(x(t), t)dW$.

## Properties of the Wiener Process

- $dW$ is a Wiener process or Brownian motion
    - $W_0 = 0$ (it starts at zero).
    - It has **stationary and independent increments**: The change in the process over any time interval ($W_{t+\Delta t} - W_t$) is independent of past changes and depends only on the length of the interval $\Delta t$, not on $t$ itself.
    - The increments are **normally distributed**: Specifically, $W_{t+\Delta t} - W_t$ follows a normal distribution with mean 0 and variance $\Delta t$. So, $dW_t$ represents a random "kick" at each instant, drawn from a normal distribution with variance $dt$.

## Ito Calculus

- In Ito calculus, the variance of the increment $dW_t$ is exactly $dt$, i.e. $(dW_t)^2 = dt$

## Ito's Lemma

This is the heart of Ito calculus. If you have a function $F(x, t)$ where $x$ follows an SDE like yours, and you want to find $dF$, you can't just use the standard chain rule.

If $dx_t = \mu_t dt + \sigma_t dW_t$ and $F(x_t, t)$ is a twice-differentiable function, then Ito's Lemma states:

$$dF = \left( \frac{\partial F}{\partial t} + \mu_t \frac{\partial F}{\partial x} + \frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2} \right) dt + \sigma_t \frac{\partial F}{\partial x} dW_t$$

See that $\frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2}$ term? That's the special Ito correction that comes from $(dW_t)^2 = dt$. It accounts for the non-differentiability and high volatility of the Wiener process.

## Paths, Differentiability, and the Meaning of the SDE

### Individual Paths are Continuous but Nowhere Differentiable

A Wiener process $W_t$ is almost surely continuous — sample paths $t \mapsto W_t$ are well-defined continuous curves. The same holds for solutions $X_t$ of an SDE: each realization is a continuous function of time.

However, these paths are **nowhere differentiable**. In an ODE, decreasing $\Delta t$ makes the ratio $\Delta X / \Delta t$ converge to the derivative $dX/dt$. In an SDE, the stochastic increment $g\,\sqrt{\Delta t}\;\xi$ contributes a term $g\,\xi / \sqrt{\Delta t}$ to that ratio, which **diverges** as $\Delta t \to 0$. No pointwise derivative exists at any $t$.

### The SDE is Shorthand for an Integral Equation

Because paths are not differentiable, the notation $dX = f\,dt + g\,dW$ is not a differential equation in the classical sense. It is shorthand for the **integral equation**:

$$X_t = X_0 + \int_0^t f(X_s, s)\,ds + \int_0^t g(X_s, s)\,dW_s$$

The first integral is an ordinary Riemann integral. The second is the **Ito integral**, defined as a mean-square limit of sums over discretizations:

$$\int_0^t g\,dW_s = \lim_{n\to\infty} \sum_i g(X_{t_i}, t_i)\,(W_{t_{i+1}} - W_{t_i})$$

This limit converges in $L^2$ (mean-square), not pointwise. Individual paths are therefore constructed through integration, never through differentiation.

### Convergence Lives at the Distribution Level

While $\Delta X / \Delta t$ has no pointwise limit, the $\Delta t \to 0$ limit is well-defined when taken over **moments of the transition density**. This is exactly what the Kramers-Moyal coefficients capture:

$$D_n(x) = \frac{1}{n!}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}[(y-x)^n]$$

The $1/\Delta t$ factor that would blow up for a single realization is tamed by the expectation $\mathbb{E}[\cdot]$, which averages over the noise. The result is the Fokker-Planck equation — an evolution equation for the probability density $p(y,t \mid x)$ that admits a genuine time derivative $\partial_t p$.

### Summary of the Three Levels

| Level | Object | Well-defined? |
|---|---|---|
| Single path $X_t$ | Continuous curve | Yes — continuous, but nowhere differentiable. No $dX/dt$. |
| SDE $dX = f\,dt + g\,dW$ | Integral equation for paths | Yes — via the Ito integral (mean-square limit). |
| Fokker-Planck $\partial_t p = \ldots$ | PDE for the density | Yes — smooth $\partial_t p$ exists. Clean calculus applies. |

The roughness of individual paths is not an artifact of discretization — it is intrinsic to Brownian motion. The SDE framework handles this by shifting from pointwise derivatives to integrals (at the path level) and to density evolution (at the population level).
