---
layout: contents
---

# Continuity Equation

## ODE and Probability Transport

An ODE with a time-dependent vector field $v_t$:

$$\frac{dx}{dt} = v_t(x)$$

deterministically transports particles. If we initialize $x_0 \sim p_0$, then at time $t$ the particles are distributed according to some density $p_t$.

## The Continuity Equation

The density $p_t$ satisfies the **continuity equation**:

$$\partial_t p_t(x) = -\nabla \cdot \big( p_t(x)\, v_t(x) \big)$$

**Intuition:** This is a local conservation law — probability is neither created nor destroyed. The term $p_t(x) v_t(x)$ is a probability flux (density times velocity). The divergence $\nabla \cdot$ measures net outflow, so $-\nabla \cdot (p_t v_t)$ is the net inflow, which equals the local rate of change $\partial_t p_t$.

**Proof Outline:**

Consider a small cube around $x$ and let it shrink to zero. The net flow of probability into the cube must equal the rate of increase of probability inside the cube. This leads directly to the continuity equation.

$$
P_{V, t+\Delta t} - P_{V, t} = \sum_{i=0}^{d} \int\limits_{t}^{t+\Delta t} \bigg( \int_{S_{x_i-\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx - \int_{S_{x_i+\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx \bigg) dt
$$

The integrand is $p_t(x)\, v(x,t) \cdot n(x)$, not just $v(x,t) \cdot n(x)$: the flux of probability through a surface element is density times velocity, not velocity alone.

$$
\lim_{\Delta t \to 0} \frac{P_{V, t+\Delta t} - P_{V, t}}{\Delta t} = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int\limits_{t}^{t+\Delta t} \sum_{i=0}^{d} \bigg( \int_{S_{x_i-\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx - \int_{S_{x_i+\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx \bigg) dt
$$

$$
\frac{dP_{V,t}}{dt} = \sum_{i=0}^{d} \bigg( \int_{S_{x_i-\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx - \int_{S_{x_i+\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx \bigg)
$$

Divide both sides by the volume $\lvert V \rvert = \prod_i \Delta x_i$ and take $V \to 0$. The left side becomes $\partial_t p_t(x)$ (since $P_{V,t}/\lvert V \rvert \to p_t(x)$). The right side: dividing by $\Delta x_i$ and shrinking the $i$-th faces gives a finite difference in the $x_i$ direction, which converges to $-\partial_{x_i}(p_t(x)\, v_i(x,t))$:

$$
\lim_{V \to 0} \frac{1}{\lvert V \rvert}\frac{dP_{V,t}}{dt} = \sum_{i=0}^{d} \lim_{\Delta x_i \to 0} \frac{1}{\Delta x_i} \bigg( \int_{S_{x_i-\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx - \int_{S_{x_i+\Delta x_i/2}} p_t(x)\, v(x, t) \cdot n(x)\, dx \bigg)
$$

$$
\partial_t p_t(x) = -\nabla \cdot \big( p_t(x)\, v_t(x) \big)
$$

