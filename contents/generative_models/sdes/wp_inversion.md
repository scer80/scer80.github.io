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

Rewrite in terms of $q(x,u)$:

$$
\frac{\partial q}{\partial u}(x, u) = \frac{\partial}{\partial x}[q(x, u)\,f(x, T-u)] - \frac{1}{2}g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2} \tag{1}
$$

## Solving for the Reverse Drift

Assume the reverse process has an unknown drift $f_q$ with the  diffusion coefficient $g_q(u)$:

$$
\frac{\partial q}{\partial u}(x, u) = -\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] + \frac{1}{2}g_q^2(u) \frac{\partial^2 q(x, u)}{\partial x^2}. \tag{2}
$$

Equate the two expressions (1) and (2) for $\frac{\partial q}{\partial u}(x,u)$:
$$\frac{\partial}{\partial x}[q(x, u)\,f(x, T-u)] - \frac{1}{2}g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2} = -\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] + \frac{1}{2}g_q^2(u) \frac{\partial^2 q(x, u)}{\partial x^2}$$

Rearrange:

$$
\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] = -\frac{\partial}{\partial x}[q(x, u)\,f(x, T-u)] + \frac{1}{2}g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2} + \frac{1}{2}g_q^2(u) \frac{\partial^2 q(x, u)}{\partial x^2}$$

The RHS is a single $\frac{\partial}{\partial x}$ of something:

$$
\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] = -\frac{\partial}{\partial x}\left[q(x, u)\,f(x, T-u) - \frac{1}{2}g^2(T-u) \frac{\partial q(x, u)}{\partial x} - \frac{1}{2}g_q^2(u) \frac{\partial q(x, u)}{\partial x}\right]
$$

Integrate once in $x$ (boundary terms vanish):

$$q(x,u)\, f_q(x,u) = -q(x,u)\, f(x, T-u) + \frac{1}{2}g^2(T-u) \frac{\partial q(x, u)}{\partial x} + \frac{1}{2}g_q^2(u) \frac{\partial q(x, u)}{\partial x}$$

Divide by $q$ and use $\frac{1}{q}\frac{\partial q}{\partial x} = \frac{\partial}{\partial x}\log q$ (score function):

$$\boxed{f_q(x, u) = -f(x, T-u) + \frac{1}{2}g^2(T-u)\, \frac{\partial}{\partial x}\log \underbrace{q(x, u)}_{p(x, T-u)} + \frac{1}{2}g_q^2(u)\, \frac{\partial}{\partial x}\log \underbrace{q(x, u)}_{p(x, T-u)}}$$

The reverse drift is the negated forward drift plus a score-weighted diffusion term.
