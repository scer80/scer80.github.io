---
layout: contents
---

# Fokker-Planck Equation for the Wiener Process

What happens if we apply the Kramers-Moyal expansion to the Wiener process with SDE: $dx = f(x,t)\,dt + g(x,t)\,dW_t$? (see [Fokker-Planck derivation](./wp_fokker_planck.md).

## Short-time Transition Density $p(y, \Delta t \mid x)$

Over a small interval $\Delta t$, starting at $x$, the SDE gives:

$$y = x + f(x)\,\Delta t + g(x)\,\sqrt{\Delta t}\;\xi, \qquad \xi \sim \mathcal{N}(0,1)$$

So $y \mid x$ is Gaussian with mean $x + f\Delta t$ and variance $g^2 \Delta t$:

$$p(y, \Delta t \mid x) = \frac{1}{\sqrt{2\pi\, g(x)^2\, \Delta t}}\;\exp\!\left(-\frac{\big(y - x - f(x)\,\Delta t\big)^2}{2\,g(x)^2\,\Delta t}\right)$$

## Computing the Kramers-Moyal Coefficients $D_n$

Recall: $D_n(x) = \frac{1}{n!}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\int (y-x)^n\, p(y, \Delta t \mid x)\, dy = \frac{1}{n!}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}[(y-x)^n]$.

From the transition density above, $y - x = f\,\Delta t + g\,\sqrt{\Delta t}\;\xi$, so all moments reduce to Gaussian moments of $\xi$.

### $D_1$ (drift)

$$D_1 = \lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}\big[f\,\Delta t + g\sqrt{\Delta t}\;\xi\big] = \lim_{\Delta t \to 0}\frac{1}{\Delta t}\big[f\,\Delta t + 0\big] = f(x)$$

### $D_2$ (diffusion)

$$D_2 = \frac{1}{2}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\,\mathbb{E}\big[(f\,\Delta t + g\sqrt{\Delta t}\;\xi)^2\big]$$

Expand the square:

$$= \frac{1}{2}\lim_{\Delta t \to 0}\frac{1}{\Delta t}\Big[\underbrace{f^2(\Delta t)^2}_{\to 0} + \underbrace{2fg\,(\Delta t)^{3/2}\,\mathbb{E}[\xi]}_{=0} + g^2\,\Delta t\,\underbrace{\mathbb{E}[\xi^2]}_{=1}\Big] = \frac{1}{2}g(x)^2$$

### $D_n$ for $n > 2$: Exactly Zero, Not Merely Neglected

Expand $(y-x)^n = (f\,\Delta t + g\sqrt{\Delta t}\;\xi)^n$ by the binomial theorem. A generic term is:

$$\binom{n}{k}(f\,\Delta t)^{n-k}(g\sqrt{\Delta t})^k\,\xi^k$$

which carries a factor $(\Delta t)^{n - k/2}$. After dividing by $\Delta t$ (as in the $D_n$ definition), the power of $\Delta t$ is $n - k/2 - 1$. For this to survive $\Delta t \to 0$, we need:

$$n - k/2 - 1 \leq 0 \quad\Longrightarrow\quad k \geq 2(n-1)$$

But $k \leq n$, so we need $2(n-1) \leq n$, i.e. $n \leq 2$.

**Therefore $D_n = 0$ exactly for all $n > 2$.** The Fokker-Planck equation is **not** a truncation of the Kramers-Moyal expansion — it is the exact, complete description for any Ito SDE driven by Gaussian noise.

## The Fokker-Planck Equation

Substituting $D_1 = f$ and $D_2 = \tfrac{1}{2}g^2$ into the Kramers-Moyal expansion:

$$\frac{\partial p(y, t \mid x)}{\partial t} = -\frac{\partial}{\partial y}\big[f(y)\, p(y,t \mid x)\big] + \frac{1}{2}\frac{\partial^2}{\partial y^2}\big[g(y)^2\, p(y,t \mid x)\big]$$
