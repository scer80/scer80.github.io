---
layout: contents
---

# Drifting Models


### 1. The Drifting Loss
Generative modeling is formulated as learning a mapping $f_\theta$ that evolves a prior distribution into a data distribution. During training, we define a **drifting field** $\mathbf{V}$ that governs the movement of samples. The goal of the optimizer is to reach an equilibrium where the drift becomes zero, implying the generated distribution matches the target distribution.

The training objective is a fixed-point loss. At any given iteration, the model attempts to move its current prediction toward a "drifted" version of itself:

$$\mathcal{L} = \mathbb{E} \left[ \| \phi(\mathbf{x}) - \text{stopgrad}\big(\phi(\mathbf{x}) + \mathbf{V}(\phi(\mathbf{x}))\big) \|^2 \right]$$

Where:
*   $\mathbf{x} = f_\theta(\epsilon)$ is the generated sample.
*   $\phi(\cdot)$ is a feature extractor (e.g., a pre-trained image encoder) used to compute the loss in a more semantically meaningful space.
*   $\text{stopgrad}$ ensures the target is "frozen" during the current optimization step, forcing the network to minimize the residual drift.

---

### 2. The Drifting Field: Attraction and Repulsion
The drifting field $\mathbf{V}$ is designed to move samples toward the real data distribution $p$ and away from the current generated distribution $q$. It is composed of two opposing components:

**The Attraction Field ($\mathbf{V}_p^+$):**
This component pulls the sample $\mathbf{x}$ toward the real data points $\mathbf{y}^+ \sim p$.
$$\mathbf{V}_p^+(\mathbf{x}) := \frac{1}{Z_p(\mathbf{x})} \mathbb{E}_{y^+ \sim p} \left[ k(\mathbf{x}, \mathbf{y}^+)(\mathbf{y}^+ - \mathbf{x}) \right]$$

**The Repulsion Field ($\mathbf{V}_q^-$):**
This component pushes the sample $\mathbf{x}$ away from other generated samples $\mathbf{y}^- \sim q$.
$$\mathbf{V}_q^-(\mathbf{x}) := \frac{1}{Z_q(\mathbf{x})} \mathbb{E}_{y^- \sim q} \left[ k(\mathbf{x}, \mathbf{y}^-)(\mathbf{y}^- - \mathbf{x}) \right]$$

**Normalization Factors:**
To ensure these fields represent valid weighted averages, we use normalization terms $Z$:
$$Z_p(\mathbf{x}) = \mathbb{E}_{y^+ \sim p}[k(\mathbf{x}, \mathbf{y}^+)], \quad Z_q(\mathbf{x}) = \mathbb{E}_{y^- \sim q}[k(\mathbf{x}, \mathbf{y}^-)]$$

The combined drifting field is simply the difference between the two:
$$\mathbf{V}_{p,q}(\mathbf{x}) = \mathbf{V}_p^+(\mathbf{x}) - \mathbf{V}_q^-(\mathbf{x})$$

---

### 3. Derivation of the Unified Formula
By substituting the attraction and repulsion terms, we can derive a single expression for the drift.

1.  **Start from the difference of fields:**
    $$\mathbf{V}_{p,q}(\mathbf{x}) = \frac{\mathbb{E}_{y^+ \sim p} [k(\mathbf{x}, \mathbf{y}^+)(\mathbf{y}^+ - \mathbf{x})]}{Z_p(\mathbf{x})} - \frac{\mathbb{E}_{y^- \sim q} [k(\mathbf{x}, \mathbf{y}^-)(\mathbf{y}^- - \mathbf{x})]}{Z_q(\mathbf{x})}$$

2.  **Use a common denominator $Z_p Z_q$:**
    $$\mathbf{V}_{p,q}(\mathbf{x}) = \frac{Z_q \,\mathbb{E}_{y^+ \sim p}[k(\mathbf{x}, \mathbf{y}^+)(\mathbf{y}^+ - \mathbf{x})] - Z_p \,\mathbb{E}_{y^- \sim q}[k(\mathbf{x}, \mathbf{y}^-)(\mathbf{y}^- - \mathbf{x})]}{Z_p Z_q}$$
    with
    $$Z_p = \mathbb{E}_{y^+ \sim p}[k(\mathbf{x}, \mathbf{y}^+)], \quad Z_q = \mathbb{E}_{y^- \sim q}[k(\mathbf{x}, \mathbf{y}^-)].$$

3.  **Move to a joint expectation:**
    Since $y^+ \sim p$ and $y^- \sim q$ are sampled independently, products of expectations can be written as expectations over the joint distribution:
    $$\mathbf{V}_{p,q}(\mathbf{x}) = \frac{1}{Z_p Z_q} \mathbb{E}_{y^+ \sim p, y^- \sim q} \Big[ k(\mathbf{x}, \mathbf{y}^+) k(\mathbf{x}, \mathbf{y}^-) \big( (\mathbf{y}^+ - \mathbf{x}) - (\mathbf{y}^- - \mathbf{x}) \big) \Big].$$

4.  **Simplify the vector term:**
    $$ (\mathbf{y}^+ - \mathbf{x}) - (\mathbf{y}^- - \mathbf{x}) = \mathbf{y}^+ - \mathbf{y}^-.$$

**Final Unified Field:**
$$\mathbf{V}_{p,q}(\mathbf{x}) = \frac{1}{Z_p Z_q} \mathbb{E}_{y^+ \sim p, y^- \sim q} \left[ k(\mathbf{x}, \mathbf{y}^+) k(\mathbf{x}, \mathbf{y}^-) (\mathbf{y}^+ - \mathbf{y}^-) \right]$$
This formula shows that the drift is a kernel-weighted difference between real and generated samples.

---

### 4. Practical Computation
In practice, the expectations are replaced with empirical sums over a mini-batch of $N_{pos}$ real samples and $N_{neg}$ generated samples.

**The Softmax Approach:**
To compute the weights, we use a similarity kernel, typically the exponential of the negative distance:
$$k(\mathbf{x}, \mathbf{y}) = \exp \left( -\frac{1}{\tau} \| \mathbf{x} - \mathbf{y} \| \right)$$
where $\tau$ is a temperature parameter controlling the "sharpness" of the neighborhood.

For a specific sample $\mathbf{x_i}$ in the batch, the weights $W_{ij}$ are computed via a **softmax** over all available $\mathbf{y}$ samples (both positive and negative):
$$W_{ij} = \text{softmax}_j \left( -\frac{1}{\tau} \| \mathbf{x_i} - \mathbf{y}_j \| \right)$$

The final drift for sample $\mathbf{x_i}$ is then calculated as:
$$\mathbf{V}(\mathbf{x_i}) = \sum_{j=1}^{N_{pos}} W_{ij}^+ \mathbf{y}_j^+ - \sum_{j=1}^{N_{neg}} W_{ij}^- \mathbf{y}_j^-$$
Where $W^+$ and $W^-$ are the normalized weights derived from the softmax operation. This ensures that samples that are "nearby" in the feature space exert the strongest influence on the drift direction.
