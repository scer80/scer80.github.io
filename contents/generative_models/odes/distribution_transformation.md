---
layout: contents
---

# Distribution Transformation via ODEs

## Key Claim

For any source distribution $p_0$ and target distribution $p_1$, there exists a time-dependent vector field $v_t$ such that the ODE

$$\frac{dx}{dt} = v_t(x), \quad t \in [0,1]$$

transports $p_0 \to p_1$: if $x_0 \sim p_0$, then $x_1 \sim p_1$.

## The Continuity Equation as Constraint

The [continuity equation](continuity_equation.md) $\partial_t p_t = -\nabla \cdot (p_t v_t)$ is the PDE constraint that $(p_t, v_t)$ must satisfy. Given a probability path $p_t$ interpolating $p_0$ and $p_1$, the vector field $v_t$ is **not unique** — many different flows can generate the same density path.

## Conditional Construction

For a fixed target $z$, the conditional vector field $v_t(x \mid z)$ generates a probability path that pushes $X_t$ toward $z$ along a straight line:

$$X_t = (1-t)X_0 + tz, \quad v_t(x|z) = \frac{z - x}{1 - t}$$

$$\frac{d}{dt} X_t = v_t(X_t|z) \implies X_t \sim p_t(\cdot|z), \quad p_0(\cdot|z) = p_{init},\; p_1(\cdot|z) = \delta_z$$

Each conditional flow is simple and tractable — a straight line from noise to data point $z$.

## Marginal Vector Field

To generate from the full distribution $p_{data}$, we average over targets:

$$v_t(x) = \int v_t(x|z)\, \frac{p_t(x|z)\, p_{data}(z)}{p_t(x)}\, dz = \mathbb{E}_{p_t(z|x)} [v_t(x|z)]$$

where the equality uses Bayes' rule: $p_t(z \mid x) = \frac{p_t(x \mid z)\,p_{data}(z)}{p_t(x)}$.

## Marginal CE from Conditional CE

Given that the conditional CE holds, the marginal CE follows — and the marginal vector field formula drops out.

**Proof:**

By definition, $p_t(x) = \int p_t(x \mid z)\, p_{data}(z)\, dz$. Differentiating w.r.t. $t$:

$$\partial_t p_t(x) = \int \partial_t p_t(x \mid z)\, p_{data}(z)\, dz$$

Applying the conditional continuity equation:

$$\partial_t p_t(x) = -\int \nabla_x \cdot (p_t(x \mid z)\, v_t(x \mid z))\, p_{data}(z)\, dz$$

Multiply and divide by $p_t(x)$:

$$
\partial_t p_t(x) = -\int \nabla_x \cdot \left( p_t(x)\,\frac{p_t(x|z)\, p_{data}(z)}{p_t(x)}\, v_t(x|z) \right) dz
$$

Extract $\nabla_x$ (passes through the integral since $p_t(x)$ does not depend on $z$):

$$
\partial_t p_t(x) = -\nabla_x \cdot \int p_t(x)\,\frac{p_t(x|z)\, p_{data}(z)}{p_t(x)}\, v_t(x|z)\, dz
$$

Extract $p_t(x)$:

$$
\partial_t p_t(x) = -\nabla_x \cdot p_t(x) \underbrace{\int \frac{p_t(x|z)\, p_{data}(z)}{p_t(x)}\, v_t(x|z)\, dz}_{v_t(x)}
$$

This is the marginal continuity equation, confirming:

$$\boxed{v_t(x) = \int \frac{p_t(x|z)\, p_{data}(z)}{p_t(x)}\, v_t(x|z)\, dz}$$

## Flow Matching

This motivates **flow matching**: rather than computing the intractable marginal $v_t(x)$ directly, we learn it by training on the tractable conditional vector field $v_t(x|z)$. The two objectives share the same minimizer. See [Flow Matching](../flow_matching/) for the full training objective and analysis.
