---
layout: contents
---

# Reverse-Time Drift for Diffusion SDEs

## Forward Process

Wiener process SDE: $dx = f(x,t)\,dt + g(t)\,dw$ (scalar, $g$ depends only on time)

Fokker-Planck (since $g^2$ comes out of $\frac{\partial^2}{\partial x^2}$):

$$\frac{\partial p}{\partial t}(x, t) = -\frac{\partial}{\partial x}[p(x,t) \, f(x, t)] + \frac{1}{2} g^2(t) \frac{\partial^2 p(x, t)}{\partial x^2}$$

## Time Reversal

Define reverse time $u = T - t$, so $du = -dt$, and reverse density $q(x, u) = p(x, T-u)$.

By the chain rule:
$$\frac{\partial q}{\partial u}(x, u) = -\frac{\partial p}{\partial t}(x, t)\bigg|_{t=T-u}$$

Substitute the forward Fokker-Planck:

$$\frac{\partial q}{\partial u}(x, u) = -\left(-\frac{\partial}{\partial x}[p(x,t)\,f(x,t)] + \frac{1}{2}g^2(t) \frac{\partial^2 p(x,t)}{\partial x^2}\right) \bigg|_{t=T-u}$$

$$
\frac{\partial q}{\partial u}(x, u) = \frac{\partial}{\partial x}[p(x,t)\,f(x,t)] \bigg|_{t=T-u} - \frac{1}{2}g^2(t) \frac{\partial^2 p(x,t)}{\partial x^2} \bigg|_{t=T-u}
$$

$$
\frac{\partial q}{\partial u}(x, u) = \frac{\partial}{\partial x}[p(x, T-u)\,f(x, T-u)] - \frac{1}{2}g^2(T-u) \frac{\partial^2 p(x, T-u)}{\partial x^2}
$$

## Solving for the Reverse Drift

Assume the reverse process has an unknown drift $f_q$ with the same diffusion $g$:
$$\frac{\partial q}{\partial u}(x, u) = -\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] + \frac{1}{2}g^2(u) \frac{\partial^2 q(x, u)}{\partial x^2}.$$

Equate the two expressions for $\frac{\partial q}{\partial u}$ (using $q = p(x, T-u)$):
$$-\frac{\partial}{\partial x}[p\, f_g] + \frac{1}{2}g^2 \frac{\partial^2 p}{\partial x^2} = \frac{\partial}{\partial x}[p\, f] - \frac{1}{2}g^2 \frac{\partial^2 p}{\partial x^2}$$

Rearrange:
$$-\frac{\partial}{\partial x}[p\, f_g] = \frac{\partial}{\partial x}[p\, f] - g^2 \frac{\partial^2 p}{\partial x^2}$$

The RHS is a single $\frac{\partial}{\partial x}$ of something:
$$-\frac{\partial}{\partial x}[p\, f_g] = \frac{\partial}{\partial x}\left[p\, f - g^2 \frac{\partial p}{\partial x}\right]$$

Integrate once in $x$ (boundary terms vanish):
$$-p\, f_g = p\, f - g^2 \frac{\partial p}{\partial x}$$

Divide by $-p$ and use $\frac{1}{p}\frac{\partial p}{\partial x} = \frac{\partial}{\partial x}\log p$ (score function):

$$\boxed{f_g(x, u) = -f(x, T-u) + g^2(T-u)\, \frac{\partial}{\partial x}\log p(x, T-u)}$$

The reverse drift is the negated forward drift plus a score-weighted diffusion term.
