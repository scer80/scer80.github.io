---
layout: contents
---

# Wiener Process and Ito Calculus

## Wiener Process SDE

### Introduction

Wiener process SDE: $dx = f(x(t),t)dt + g(x(t), t)dW$.

- $dW$ is a Wiener process (or Brownian motion)
- $W_0 = 0$ (it starts at zero)
- **stationary and independent increments**: 
    - $W_{t+\Delta t} - W_t$ is independent of past changes and depends only on the length of the interval $\Delta t$, not on $t$ itself.
- **normally distributed**: $W_{t+\Delta t} - W_t \sim \mathcal{N}(0, \Delta t)$ (i.e. variance of $W_{t+\Delta t} - W_t$ is $\Delta t$)

### The SDE is Shorthand for an Integral Equation

The notation $dX = f\,dt + g\,dW$ is not a differential equation in the classical sense. It is shorthand for the **integral equation**:

$$X_t = X_0 + \int\limits_0^t f(X_s, s)\,ds + \int\limits_0^t g(X_s, s)\,dW_s$$

- The first integral is an ordinary Riemann integral. 
- The second, $Y = \int\limits_0^t g(X_s, s)\,dW_s$, is an **Ito integral** — a **random variable** with a well-defined probability distribution.

**Generating samples via Euler-Maruyama.** To draw a sample of $X_t$, partition $[0,t]$ into $n$ steps of size $\Delta t = t/n$ and iterate:

$$X_{t_{i+1}} = X_{t_i} + f(X_{t_i}, t_i)\,\Delta t + g(X_{t_i}, t_i)\,\sqrt{\Delta t}\;\xi_i, \qquad \xi_i \overset{\text{iid}}{\sim} \mathcal{N}(0,1).$$

**Formal definition.** $S_n = \sum_i g(X_{t_i}, t_i)\,(W_{t_{i+1}} - W_{t_i})$ is a well-defined random variable (a finite sum).

$\mathbb{E}[(S_n - S_m)^2] \to 0$ as $m, n \to \infty$, this means that $S_n$ converges to a unique limiting random variable $I$ in $L^2$ norm, which is defined to be the Ito integral:

$$\int\limits_0^t g\,dW_s := I, \qquad \mathbb{E}\!\Big[\Big(S_n - I\Big)^2\Big] \to 0$$

**When do all step sizes give the same distribution?**
- For the pure Wiener increment ($g$ constant, $f = 0$), summing $n$ independent $\mathcal{N}(0, \Delta t)$ increments always yields $\mathcal{N}(0, t)$ exactly — the distribution is the same for any $n$, because Wiener increments are independent and Gaussian. 
- For a state-dependent $g(X_t, t)$, each step evaluates $g$ at the start of the interval rather than continuously, introducing a discretization bias. As $n \to \infty$ (i.e. $\Delta t \to 0$), this bias vanishes and the distribution of the numerical approximation converges to the true distribution of $X_t$.
