---
layout: contents
---

# Ito Calculus


## Ito Calculus

- In Ito calculus, the variance of the increment $dW_t$ is exactly $dt$, i.e. $(dW_t)^2 = dt$

## Ito's Lemma

This is the heart of Ito calculus. If you have a function $F(x, t)$ where $x$ follows an SDE like yours, and you want to find $dF$, you can't just use the standard chain rule.

If $dx_t = \mu_t dt + \sigma_t dW_t$ and $F(x_t, t)$ is a twice-differentiable function, then Ito's Lemma states:

$$dF = \left( \frac{\partial F}{\partial t} + \mu_t \frac{\partial F}{\partial x} + \frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2} \right) dt + \sigma_t \frac{\partial F}{\partial x} dW_t$$

See that $\frac{1}{2} \sigma_t^2 \frac{\partial^2 F}{\partial x^2}$ term? That's the special Ito correction that comes from $(dW_t)^2 = dt$. It accounts for the non-differentiability and high volatility of the Wiener process.