---
layout: contents
---

## Vector Fields (ODE Perspective)

### **Conditional Vector Field:**

For a fixed target $z$, the conditional vector field $u_t(x \mid z)$ generates a probability path that pushes $X_t$ toward $z$:

$$X_t = (1-t)X_0 + tz, \quad u_t(x|z) = \frac{z - x}{1 - t}$$

$$\frac{d}{dt} X_t = u_t(X_t|z) \implies X_t \sim p_t(\cdot|z), \quad p_0(\cdot|z) = p_{init},\; p_1(\cdot|z) = \delta_z$$

###  **Marginal Vector Field**

To generate any data point from the full distribution $p_{data}$, we use an "averaged" vector field:

$$u_t(x) = \int u_t(x|z) \frac{p_t(x|z)p_{data}(z)}{p_t(x)} dz = \int u_t(x|z) p_t(z|x) dz = \mathbb{E}_{p_t(z|x)} [u_t(x|z)]$$

where the second equality follows from Bayes' rule: $p_t(z|x) = \frac{p_t(x|z)\,p_{data}(z)}{p_t(x)}$.

#### Side Note: Continuity Equation

- No proof is provided, this can be checked by using a cube around $x$ that is squeezed to zero. 
- Conditional flow continuity equation: $\partial_t p_t(x \mid z) = -\nabla_x \cdot (p_t(x \mid z) u_t(x \mid z))$.
- Marginal flow continuity equation: $\partial_t p_t(x) = -\nabla_x \cdot (p_t(x) u_t(x))$.

**Proof:** 

By definition, $p_t(x) = \int p_t(x \mid z) p_{data}(z) dz$. Differentiating w.r.t. $t$:

$$\partial_t p_t(x) = \int \partial_t p_t(x \mid z) p_{data}(z) dz. $$

Applying the conditional continuity equation:

$$\partial_t p_t(x) = -\int \nabla_x \cdot (p_t(x \mid z) u_t(x \mid z)) p_{data}(z) dz.$$


We multiply and divide by $p_t(x)$:

$$
\partial_t p_t(x) = -\int \nabla_x \cdot \left( p_t(x)\dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} u_t(x|z) \right) dz.
$$

Extract the $\nabla_x$:

$$
\partial_t p_t(x) = -\nabla_x \cdot \int p_t(x)\dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} u_t(x|z) dz.
$$

Extract $p_t(x)$:

$$
\partial_t p_t(x) = -\nabla_x \cdot p_t(x) \underbrace{\int \dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} u_t(x|z)  dz}_{u_t(x)}.
$$

This is exactly the marginal continuity equation $\partial_t p_t(x) = -\nabla_x \cdot (p_t(x) u_t(x))$ and therefore:
$$\boxed{u_t(x) = \int \dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} u_t(x|z)  dz}.$$


## Scores (Diffusion Perspective)

*Note*: the role of this paragraph is still being worked on, as I do not understand its role.

### **Conditional Score:**

For a fixed target $z$, the conditional score is $\nabla_x \log p_t(x \mid z)$.

**Gaussian Path Example:** For $p_t(x \mid z) = \mathcal{N}(x;\, \alpha_t z,\, \beta_t^2 I)$:

$$\nabla_x \log p_t(x|z) = -\frac{x - \alpha_t z}{\beta_t^2}$$

- If $\alpha_t = 1-t$ and $\beta_t^2 = t(1-t)$, then $\nabla_x \log p_t(x|z) = \frac{z-x}{1-t}$, which is exactly the conditional vector field from the ODE perspective.
- If $\alpha_1 = 1$ and $\beta_1^2 = 0$, then $p_1(x|z) = \delta_z$ i.e. the final distribution is a delta function at $z$.

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

## The SDE Extension Trick
This theorem connects the deterministic Flow (ODE) to the stochastic Diffusion (SDE). It states that an SDE can follow the same probability path as an ODE if the drift is adjusted using the score:
*   **SDE Formula:** $dX_t = \left[ u_t(X_t) + \frac{\sigma_t^2}{2} \nabla \log p_t(X_t) \right] dt + \sigma_t dW_t$
*   **Fokker-Planck Equation:** Confirms the density evolution $\partial_t p_t = -\text{div}(p_t u_t)$.


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
