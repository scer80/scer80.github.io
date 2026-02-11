---
layout: contents
---

The handwritten notes you provided describe the mathematical foundations of **Flow Matching** and **Diffusion Models**, specifically focusing on how to transition from sample-specific (conditional) dynamics to global (marginal) dynamics. This theory provides the rigorous "why" behind the formulas used in **Classifier and Classifier-Free Guidance**.

Below is a clear extraction of the content, followed by an explanation of how these concepts link to Guidance.

---

### 1. Content Extraction from the Notes

#### A. Vector Fields (ODE Perspective)
*   **Conditional Vector Field:** A velocity field $u_t(x|z)$ that moves a single noise sample $X_0 \sim p_{init}$ toward a specific data point $z$.
    $$\frac{d}{dt} X_t = u_t(X_t|z) \implies X_t \sim p_t(\cdot|z)$$
*   **Marginal Vector Field:** To generate any data point from the full distribution $p_{data}$, we use an "averaged" vector field:
    $$u_t(x) = \int u_t(x|z) \frac{p_t(x|z)p_{data}(z)}{p_t(x)} dz = \mathbb{E}_{p_t(z|x)} [u_t(x|z)]$$
*   **Continuity Equation (Proof):** The notes prove that the marginal vector field correctly evolves the total probability density:
    $$\frac{\partial}{\partial t} p(x,t) = -\nabla \cdot (p(x,t) u_t(x))$$

#### B. Scores (Diffusion Perspective)
*   **Marginal Score:** The gradient of the log-density $\nabla_x \log p_t(x)$.
*   **Score Relation:** Just like vector fields, the marginal score is the expectation of conditional scores:
    $$\nabla \log p_t(x) = \mathbb{E}_{p_t(z|x)} [\nabla \log p_t(x|z)]$$
*   **Gaussian Path Example:** For a typical diffusion path $p_t(x|z) = \mathcal{N}(x; \alpha_t z, \beta_t^2 I)$, the conditional score is:
    $$\nabla \log p_t(x|z) = -\frac{x - \alpha_t z}{\beta_t^2}$$

#### C. The SDE Extension Trick
This theorem connects the deterministic Flow (ODE) to the stochastic Diffusion (SDE). It states that an SDE can follow the same probability path as an ODE if the drift is adjusted using the score:
*   **SDE Formula:** $dX_t = \left[ u_t(X_t) + \frac{\sigma_t^2}{2} \nabla \log p_t(X_t) \right] dt + \sigma_t dW_t$
*   **Fokker-Planck Equation:** Confirms the density evolution $\partial_t p_t = -\text{div}(p_t u_t)$.

---

### 2. Making it Better: Connecting to Guidance

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
| **Vector Field** | $u_t(x) = \mathbb{E}[u_t(x|z)]$ | Used in **CFG** to interpolate between $u_{uncond}$ and $u_{cond}$. |
| **Score** | $\nabla \log p_t = \mathbb{E}[\nabla \log p_{t|z}]$ | Used in **Classifier Guidance** to add a label gradient. |
| **SDE Trick** | $dX_t = [u + \frac{\sigma^2}{2}\nabla \log p]dt$ | Allows you to switch between **ODE solvers** (fast) and **SDE samplers** (high quality). |

**Why this matters:** Your notes show that the "marginal" model (the one that doesn't know the label) is actually just the average of all possible "conditional" models. Guidance works by pushing the model away from that "average" (unconditional) state and further toward a specific "labeled" state.
