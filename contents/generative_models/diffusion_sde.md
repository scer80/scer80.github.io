---
layout: contents
---


# Diffusion SDE

## Wiener Process and Ito Calculus

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

## Fokker-Planck Equation for the Wiener Process

The SDE describes a **single trajectory** $x(t)$. The Fokker-Planck equation (FPE) describes how the **probability density** $p(x,t)$ of an ensemble of such trajectories evolves over time.

Given the SDE $dx = f(x,t)\,dt + g(x,t)\,dW_t$, the corresponding FPE is:

$$\frac{\partial p(x,t)}{\partial t} = -\frac{\partial}{\partial x}\Big[f(x,t)\,p(x,t)\Big] + \frac{1}{2}\frac{\partial^2}{\partial x^2}\Big[g(x,t)^2\,p(x,t)\Big]$$

- **First term** (drift): $-\frac{\partial}{\partial x}[f \cdot p]$ — probability flows along the drift $f$. This is a continuity/transport equation.
- **Second term** (diffusion): $\frac{1}{2}\frac{\partial^2}{\partial x^2}[g^2 \cdot p]$ — noise spreads probability out. This is a diffusion equation.

**Derivation sketch** (via Ito's Lemma): For any smooth test function $\phi(x)$, compute $d\mathbb{E}[\phi(x_t)]$ using Ito's Lemma:

$$d\phi = \left(f\,\frac{\partial \phi}{\partial x} + \frac{1}{2}g^2\,\frac{\partial^2 \phi}{\partial x^2}\right)dt + g\,\frac{\partial \phi}{\partial x}\,dW_t$$

Taking expectations ($\mathbb{E}[dW_t]=0$) and integrating by parts twice to move derivatives from $\phi$ onto $p$ yields the FPE.

**Special case — pure Wiener process** ($f=0$, $g=1$, i.e. $dx = dW_t$):

$$\frac{\partial p}{\partial t} = \frac{1}{2}\frac{\partial^2 p}{\partial x^2}$$

This is just the **heat equation**. Starting from $p(x,0)=\delta(x)$, the solution is $p(x,t) = \frac{1}{\sqrt{2\pi t}}\exp\!\left(-\frac{x^2}{2t}\right)$ — a Gaussian that spreads as $\sqrt{t}$.

**Multivariate extension**: For $d\mathbf{x} = \mathbf{f}(\mathbf{x},t)\,dt + \mathbf{G}(\mathbf{x},t)\,d\mathbf{W}_t$:

$$\frac{\partial p}{\partial t} = -\sum_i \frac{\partial}{\partial x_i}[f_i\,p] + \frac{1}{2}\sum_{i,j}\frac{\partial^2}{\partial x_i \partial x_j}\Big[(\mathbf{G}\mathbf{G}^\top)_{ij}\,p\Big]$$

where $\mathbf{G}\mathbf{G}^\top$ is the diffusion tensor.
