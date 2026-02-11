---
layout: contents
---

# Reverse-Time Drift for Diffusion SDEs

## Forward Process

SDE: $dx = f(x,t)\,dt + g(t)\,dw$ (scalar, $g$ depends only on time)

Fokker-Planck (since $g^2$ comes out of $\frac{\partial^2}{\partial x^2}$):

$$\frac{\partial p}{\partial t} = -\frac{\partial}{\partial x}[p\, f] + \frac{1}{2} g^2(t) \frac{\partial^2 p}{\partial x^2}$$

## Time Reversal

Define reverse time $u = T - t$, so $du = -dt$, and reverse density $q(x, u) = p(x, T-u)$.

By the chain rule:
$$\frac{\partial q}{\partial u} = -\frac{\partial p}{\partial t}\bigg|_{t=T-u}$$

Substitute the forward Fokker-Planck:
$$\frac{\partial q}{\partial u} = -\left(-\frac{\partial}{\partial x}[p\,f] + \frac{1}{2}g^2 \frac{\partial^2 p}{\partial x^2}\right) = \frac{\partial}{\partial x}[p\,f] - \frac{1}{2}g^2 \frac{\partial^2 p}{\partial x^2}$$

## Solving for the Reverse Drift

Assume the reverse process has an unknown drift $f_g$ with the same diffusion $g$:
$$\frac{\partial q}{\partial u} = -\frac{\partial}{\partial x}[q\, f_g] + \frac{1}{2}g^2 \frac{\partial^2 q}{\partial x^2}$$

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
