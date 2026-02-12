---
layout: contents
---


# Diffusion SDE

SDE: $dx=f(x(t),t)dt+g(x(t), t)dW$.

- $dW$ is a Wiener process or Brownian motion
    *   $W_0 = 0$ (it starts at zero).
    *   It has **stationary and independent increments**: This means that the change in the process over any time interval ($W_{t+\Delta t} - W_t$) is independent of past changes and depends only on the length of the interval $\Delta t$, not on $t$ itself.
    *   The increments are **normally distributed**: Specifically, $W_{t+\Delta t} - W_t$ follows a normal distribution with mean 0 and variance $\Delta t$. So, $dW_t$ represents a random "kick" at each instant, drawn from a normal distribution with variance $dt$.
- in Ito calculus, the variance of the increment $dW_t$ is exactly $dt$, i.e. $(dW_t)^2 = dt$
- **Ito's Insight: Ito's Lemma**: This is the heart of Ito calculus. If you have a function $F(x, t)$ where $x$ follows an SDE like yours, and you want to find $dF$, you can't just use the standard chain rule. 
    * $dx_t = \mu_t dt + \sigma_t dW_t$ and $F(x_t, t)$ is a twice-differentiable function, then Ito's Lemma states:
    * $dF = \left( \frac{\partial F}{\partial t} + \mu_t \frac{\partial F}{\partial x} + \frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2} \right) dt + \sigma_t \frac{\partial F}{\partial x} dW_t$

    See that $\frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2}$ term? That's the special Ito correction that comes from $(dW_t)^2 = dt$. It accounts for the non-differentiability and high volatility of the Wiener process.


