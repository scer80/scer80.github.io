---
layout: contents
---

# ODE Inversion

## Setup

Assume an ODE:

$$\frac{dx(t)}{dt} = f(x(t), t)$$

that transforms $p_0$ to $p_T$ according to the [continuity equation](continuity_equation.md):

$$\partial_t p_t(x) = -\nabla \cdot \big( p_t(x)\, f(x, t) \big). \tag{3}$$

**Goal:** find the reverse ODE that transports $p_T \to p_0$.

## Derivation via CE Time-Reversal

The reverse ODE must transform $q_0 = p_T$ to $q_T = p_0$ along the trajectory $q(x, u) = p(x, T-u)$, and therefore:

$$
\partial_u q_u(x) = -\partial_t p_t(x)\bigg|_{t=T-u}. \tag{4}
$$

The continuity equation for the inverse ODE is:

$$
\partial_u q_u(x) = -\nabla \cdot \big( q_u(x)\, f_{q}(x, u) \big). \tag{5}
$$

We rewrite (4) using (3) and (5):

$$
-\nabla \cdot \big( p_t(x)\, f(x, t) \big) = \nabla \cdot \big( \underbrace{q_u(x)}_{p(x, T-u)}\, f_{q}(x, u) \big)\bigg|_{u=T-t}
$$

$$
-\nabla \cdot \big( p_t(x)\, f(x, t) \big) = \nabla \cdot \big( p(x, t)\, f_{q}(x, T-t) \big)
$$

## Result

$$\boxed{f_{q}(x, T-t) = -f(x, t)} \quad \Rightarrow \quad \boxed{f_{q}(x, u) = -f(x, T-u)}$$

The reverse drift is the forward drift **negated and time-flipped**.
