---
layout: contents
---

## Scores (Diffusion Perspective)

*Note*: the role of this paragraph is still being worked on, as I do not understand its role.

### **Conditional Score:**

For a fixed target $z$, the conditional score is $\nabla_x \log p_t(x \mid z)$.

**Gaussian Path Example:** For $p_t(x \mid z) = \mathcal{N}(x;\, \alpha_t z,\, \beta_t^2 I)$:

$$\nabla_x \log p_t(x|z) = -\frac{x - \alpha_t z}{\beta_t^2}$$

- If $\alpha_t = 1-t$ and $\beta_t^2 = t(1-t)$, then $\nabla_x \log p_t(x|z) = \frac{z-x}{1-t}$, which is exactly the conditional vector field from the ODE perspective.
- If $\alpha_1 = 1$ and $\beta_1^2 = 0$, then $p_1(x \mid z) = \delta_z$ i.e. the final distribution is a delta function at $z$.

### **Marginal Score**

The marginal score is the posterior expectation of the conditional score:

$$\nabla_x \log p_t(x) = \mathbb{E}_{p_t(z|x)} [\nabla_x \log p_t(x|z)]$$

**Proof:**

By definition, $p_t(x) = \int p_t(x \mid z)\, p_{data}(z)\, dz$. Taking $\nabla_x \log$ of both sides:

$$\nabla_x \log p_t(x) = \frac{\nabla_x p_t(x)}{p_t(x)}.$$

Differentiating under the integral:

$$\nabla_x p_t(x) = \int \nabla_x p_t(x \mid z)\, p_{data}(z)\, dz.$$

Rewriting $\nabla_x p_t(x \mid z) = p_t(x \mid z)\, \nabla_x \log p_t(x \mid z)$:

$$\nabla_x p_t(x) = \int p_t(x \mid z)\, \nabla_x \log p_t(x \mid z)\, p_{data}(z)\, dz.$$

Dividing by $p_t(x)$ and recognizing $\frac{p_t(x \mid z)\, p_{data}(z)}{p_t(x)} = p_t(z \mid x)$ by Bayes' rule:

$$\boxed{\nabla_x \log p_t(x) = \int p_t(z \mid x)\, \nabla_x \log p_t(x \mid z)\, dz = \mathbb{E}_{p_t(z|x)} [\nabla_x \log p_t(x|z)]}$$
