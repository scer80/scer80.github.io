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

Assume the reverse process has an unknown drift $f_q$ with the same diffusion coefficient $g(T-u)$ (at reverse time $u$ the noise level matches the forward process at $t = T-u$):
$$\frac{\partial q}{\partial u}(x, u) = -\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] + \frac{1}{2}g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2}. \tag{2}$$

Equate the two expressions (1) and (2) for $\frac{\partial q}{\partial u}(x,u)$:
$$\frac{\partial}{\partial x}[q(x, u)\,f(x, T-u)] - \frac{1}{2}g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2} = -\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] + \frac{1}{2}g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2}$$

The $\frac{1}{2}g^2(T-u)\,\partial^2_x q$ terms combine. Rearrange:

$$
\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] = -\frac{\partial}{\partial x}[q(x, u)\,f(x, T-u)] + g^2(T-u) \frac{\partial^2 q(x, u)}{\partial x^2}$$

The RHS is a single $\frac{\partial}{\partial x}$ of something:

$$
\frac{\partial}{\partial x}[q(x, u)\, f_q(x, u)] = -\frac{\partial}{\partial x}\left[q(x, u)\,f(x, T-u) - g^2(T-u) \frac{\partial q(x, u)}{\partial x}\right]
$$

Integrate once in $x$ (boundary terms vanish):

$$q(x,u)\, f_q(x,u) = -q(x,u)\, f(x, T-u) + g^2(T-u) \frac{\partial q(x, u)}{\partial x}$$

Divide by $q$ and use $\frac{1}{q}\frac{\partial q}{\partial x} = \frac{\partial}{\partial x}\log q$ (score function):

$$\boxed{f_q(x, u) = -f(x, T-u) + g^2(T-u)\, \frac{\partial}{\partial x}\log \underbrace{q(x, u)}_{p(x, T-u)}}$$

The reverse drift is the negated forward drift plus a score-weighted diffusion term.

## Connecting ODE-SDE Equivalence with Diffusion Inversion

### ODE Inversion

See [ODE Inversion](odes/inversion.md) for the derivation. The result is:

$$\boxed{f_{q}(x, u) = -f(x, T-u)}$$

The reverse drift is the forward drift negated and time-flipped — no score function required.

### Equivalent SDE of the ODE Forward

By [ODE-SDE equivalence](ode_sde_equivalence.md), for any noise schedule $\sigma_t \geq 0$, the SDE

$$dx(t) = \left[ f(x, t) + \frac{\sigma_t^2}{2} \frac{\partial}{\partial x}\log p_t(x) \right] dt + \sigma_t\, dW_t \tag{6}$$

generates the same density path $p_t$ as the forward ODE. The drift decomposes into the original ODE drift $f$ plus a score correction that counteracts the diffusion.

### Equivalent SDE of the ODE Backward

The reverse ODE has drift $f_q(x, u) = -f(x, T-u)$ and generates $q_u$. Applying ODE-SDE equivalence again, for any noise schedule $\tilde{\sigma}_u \geq 0$:

$$dx(u) = \left[ -f(x, T-u) + \frac{\tilde{\sigma}_u^2}{2} \frac{\partial}{\partial x}\log q_u(x) \right] du + \tilde{\sigma}_u\, dW_u \tag{7}$$

generates the same density $q_u$ as the reverse ODE.

### Inversion of SDE Equivalent of ODE Forward

Alternatively, we can take the forward SDE (6) and invert it directly using the reverse-time drift formula from this document. The forward SDE has drift $\tilde{f}(x, t) = f(x, t) + \frac{\sigma_t^2}{2} \frac{\partial}{\partial x}\log p_t(x)$ and diffusion $g(t) = \sigma_t$. Applying the boxed result:

$$f_q(x, u) = -\tilde{f}(x, T-u) + g^2(T-u)\, \frac{\partial}{\partial x}\log q_u(x)$$

$$= -f(x, T-u) - \frac{\sigma_{T-u}^2}{2} \frac{\partial}{\partial x}\log \underbrace{p_{T-u}(x)}_{q_u(x)} + \sigma_{T-u}^2\, \frac{\partial}{\partial x}\log q_u(x)$$

$$= -f(x, T-u) + \frac{\sigma_{T-u}^2}{2} \frac{\partial}{\partial x}\log q_u(x)$$

The half of the score from the forward drift cancels against the full score from the inversion formula, leaving half. The inverted SDE is:

$$dx(u) = \left[ -f(x, T-u) + \frac{\sigma_{T-u}^2}{2} \frac{\partial}{\partial x}\log q_u(x) \right] du + \sigma_{T-u}\, dW_u \tag{8}$$

This is identical to (7) with $\tilde{\sigma}_u = \sigma_{T-u}$. The two routes — *invert then add noise* vs. *add noise then invert* — commute: the noise schedule simply gets time-reversed.

