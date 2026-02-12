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


### Connecting to Guidance

The notes explain the "Marginalization" of the vector field. In **Guidance**, we add a class or text condition $c$. Here is how these theoretical notes translate into the guidance formulas you use in practice:

#### Classifier Guidance (CG)
This uses the **Score** logic from the notes. We want to sample from $p(x|c)$, but we only have a model for $p(x)$. Using Bayes' Rule:
$$\nabla \log p(x|c) = \nabla \log p(x) + \underbrace{\nabla \log p(c|x)}_{\text{Classifier Gradient}}$$
The "better" version of this uses a guidance scale $w$:
$$\text{Guided Score} = \nabla \log p(x) + w \nabla \log p(c|x)$$

#### Classifier-Free Guidance (CFG)
CFG avoids an external classifier by using the **Marginal vs. Conditional Vector Field** logic. During training, you learn a conditional field $u(x, t, c)$ and occasionally "drop" the condition to learn the unconditional (marginal) field $u(x, t, \emptyset)$.
At inference, you extrapolate between the two:
$$u_{guided} = u(x, t, \emptyset) + w \cdot \big( u(x, t, c) - u(x, t, \emptyset) \big)$$

### Summary Comparison

| Concept | Theory (from your notes) | Application (Guidance) |
| :--- | :--- | :--- |
| **Vector Field** | $u_t(x) = \mathbb{E}[u_t(x \mid z)]$ | Used in **CFG** to interpolate between $u_{uncond}$ and $u_{cond}$. |
| **Score** | $\nabla \log p_t = \mathbb{E}[\nabla \log p_{t \mid z}]$ | Used in **Classifier Guidance** to add a label gradient. |
| **SDE Trick** | $dX_t = [u + \frac{\sigma^2}{2}\nabla \log p]dt$ | Allows you to switch between **ODE solvers** (fast) and **SDE samplers** (high quality). |

**Why this matters:** Your notes show that the "marginal" model (the one that doesn't know the label) is actually just the average of all possible "conditional" models. Guidance works by pushing the model away from that "average" (unconditional) state and further toward a specific "labeled" state.
