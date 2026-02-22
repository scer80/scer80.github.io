---
layout: contents
---

## Score Function

- Definition: $\nabla_y \log{P(y)}$
- $\sigma^2 \nabla_y \log{P(y)} = \mathbb{E}(x \mid y) - y$
- the score function points in the direction of the MMSE solution
- $y$ is corrupted by Gaussian noise from $x$ (can this be made more general?)
  - $\nabla_y P(y)$ direction maximizing $P(y)$
  - $\nabla_y \log{P(y)} = \frac{\nabla_y P(y)}{P(y)}$ same direction

### Score Function and Conditional Expectation

**Theorem.** For any additive noise model $y = x + n$:

$$\nabla_y \log p(y) = \mathbb{E}[\nabla_y \log p(y \mid x) \mid y]$$

*Proof.* Starting from the marginal:

$$\nabla_y \log p(y) = \frac{\nabla_y p(y)}{p(y)} = \frac{\int \nabla_y p(y \mid x) \, p(x) \, dx}{p(y)}$$

$$= \frac{\int \nabla_y \log p(y \mid x) \cdot p(y \mid x) \, p(x) \, dx}{p(y)} = \int \nabla_y \log p(y \mid x) \cdot p(x \mid y) \, dx$$

$$= \mathbb{E}[\nabla_y \log p(y \mid x) \mid y] \quad \square$$

**Corollary (Location families).** If $p(y \mid x) = f(y - x)$ for some noise density $f$ with score function $s_n$, then:

$$\nabla_y \log p(y) = \mathbb{E}[s_n(y - x) \mid y]$$

*Proof.* For location families, $\nabla_y \log p(y \mid x) = \frac{f'(y-x)}{f(y-x)} = s_n(y - x)$. Apply the theorem. $\square$

**Corollary (Gaussian noise).** If $n \sim \mathcal{N}(0, \sigma^2 I)$, then:

$$\sigma^2 \nabla_y \log p(y) = \mathbb{E}[x \mid y] - y$$

*Proof.* For Gaussian noise, $s_n(n) = -n/\sigma^2$. By the location family corollary:

$$\nabla_y \log p(y) = \mathbb{E}\left[\frac{-(y-x)}{\sigma^2} \mid y\right] = \mathbb{E}\left[\frac{x - y}{\sigma^2} \mid y\right] = \frac{\mathbb{E}[x \mid y] - y}{\sigma^2}$$

Rearranging gives the result. $\square$

**Why Gaussian is special:** For Gaussian noise, $s_n(n) = -n/\sigma^2$ is linear. This linearity allows the expectation to factor, yielding a direct relationship between the score and the MMSE estimator $\mathbb{E}[x \mid y]$.

For non-Gaussian noise (e.g., Laplacian where $s_n(n) = -\text{sign}(n)/b$), the score is nonlinear and no such simplification occurs.
