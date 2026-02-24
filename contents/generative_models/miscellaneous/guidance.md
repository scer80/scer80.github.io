---
layout: contents
---

# Guidance

### Connecting to Guidance

The notes explain the "Marginalization" of the vector field. In **Guidance**, we add a class or text condition $c$. Here is how these theoretical notes translate into the guidance formulas you use in practice:

#### Classifier Guidance (CG)

This uses the **Score** logic from the notes. We want to sample from $p(x|c)$, but we only have a model for $p(x)$. Using Bayes' Rule:
$$\nabla \log p(x|c) = \nabla \log p(x) + \underbrace{\nabla \log p(c|x)}_{\text{Classifier Gradient}}.$$

The "better" version of this uses a guidance scale $w$:

$$\nabla \log p(x) + w \nabla \log p(c|x).$$



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
