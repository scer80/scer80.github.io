# Generative Models

## Score Function

- Definition: $\nabla_y \log{P(y)}$
- $\sigma^2 \nabla_y \log{P(y)} = \mathbb{E}(x| y) - y$
- the score function points in the direction of the MMSE solution
- $y$ is corrupted by Gaussian noise from $x$ (can this be made more general?)
  - $\nabla_y P(y)$ direction maximizing $P(y)$
  - $\nabla_y \log{P(y)} = \frac{\nabla_y P(y)}{P(y)}$ same direction

### Proof: Score Function and MMSE Relationship

**Setup:** Let $y = x + n$ where $n \sim \mathcal{N}(0, \sigma^2 I)$ is Gaussian noise.

**Goal:** Show that $\sigma^2 \nabla_y \log p(y) = \mathbb{E}[x|y] - y$

**Proof:**

The marginal distribution is:

$$p(y) = \int p(y|x) p(x) \, dx$$

where $p(y|x) = \mathcal{N}(y; x, \sigma^2 I)$.

Taking the gradient with respect to $y$:

$$\nabla_y p(y) = \int \nabla_y p(y|x) \, p(x) \, dx$$

For a Gaussian, $\nabla_y \log p(y|x) = \frac{x - y}{\sigma^2}$, so:

$$\nabla_y p(y|x) = p(y|x) \cdot \frac{x - y}{\sigma^2}$$

Substituting:

$$\nabla_y p(y) = \frac{1}{\sigma^2} \int (x - y) \, p(y|x) \, p(x) \, dx$$

Using Bayes' rule, $p(y|x) p(x) = p(x|y) p(y)$:

$$\nabla_y p(y) = \frac{p(y)}{\sigma^2} \int (x - y) \, p(x|y) \, dx = \frac{p(y)}{\sigma^2} \left( \mathbb{E}[x|y] - y \right)$$

Therefore:

$$\nabla_y \log p(y) = \frac{\nabla_y p(y)}{p(y)} = \frac{1}{\sigma^2} \left( \mathbb{E}[x|y] - y \right)$$

Rearranging gives:

$$\boxed{\sigma^2 \nabla_y \log p(y) = \mathbb{E}[x|y] - y}$$

### Generalization Beyond Gaussian Noise

For any additive noise model $y = x + n$, we can derive a more general relationship.

Starting from the marginal:

$$\nabla_y \log p(y) = \frac{\nabla_y p(y)}{p(y)} = \frac{\int \nabla_y p(y|x) \, p(x) \, dx}{p(y)}$$

$$= \frac{\int \nabla_y \log p(y|x) \cdot p(y|x) \, p(x) \, dx}{p(y)} = \int \nabla_y \log p(y|x) \cdot p(x|y) \, dx$$

This gives the general result:

$$\boxed{\nabla_y \log p(y) = \mathbb{E}[\nabla_y \log p(y|x) \mid y]}$$

For **location families** where $p(y|x) = f(y - x)$ for some noise density $f$:

$$\nabla_y \log p(y|x) = \frac{f'(y-x)}{f(y-x)} = s_n(y - x)$$

where $s_n$ is the score function of the noise distribution. Thus:

$$\nabla_y \log p(y) = \mathbb{E}[s_n(y - x) \mid y]$$

**Why Gaussian is special:** For Gaussian noise, $s_n(n) = -n/\sigma^2$ is linear. This linearity allows the expectation to factor:

$$\nabla_y \log p(y) = \mathbb{E}\left[\frac{x - y}{\sigma^2} \mid y\right] = \frac{\mathbb{E}[x|y] - y}{\sigma^2}$$

For non-Gaussian noise (e.g., Laplacian where $s_n(n) = -\text{sign}(n)/b$), the score is nonlinear and no such simplification occurs.
