---
layout: contents
---

# Flow Matching

## Vector Fields (ODE Perspective)

### **Conditional Vector Field:**

For a fixed target $z$, the conditional vector field $v_t(x \mid z)$ generates a probability path that pushes $X_t$ toward $z$:

$$X_t = (1-t)X_0 + tz, \quad v_t(x|z) = \frac{z - x}{1 - t}$$

$$\frac{d}{dt} X_t = v_t(X_t|z) \implies X_t \sim p_t(\cdot|z), \quad p_0(\cdot|z) = p_{init},\; p_1(\cdot|z) = \delta_z$$

###  **Marginal Vector Field**

To generate any data point from the full distribution $p_{data}$, we use an "averaged" vector field:

$$v_t(x) = \int v_t(x|z) \frac{p_t(x|z)p_{data}(z)}{p_t(x)} dz = \int v_t(x|z) p_t(z|x) dz = \mathbb{E}_{p_t(z|x)} [v_t(x|z)]$$

where the second equality follows from Bayes' rule: $p_t(z \mid x) = \frac{p_t(x \mid z)\,p_{data}(z)}{p_t(x)}$.

#### Side Note: Continuity Equation

- No proof is provided, this can be checked by using a cube around $x$ that is squeezed to zero.
- Conditional flow continuity equation: $\partial_t p_t(x \mid z) = -\nabla_x \cdot (p_t(x \mid z) v_t(x \mid z))$.
- Marginal flow continuity equation: $\partial_t p_t(x) = -\nabla_x \cdot (p_t(x) v_t(x))$.

**Proof:**

By definition, $p_t(x) = \int p_t(x \mid z) p_{data}(z) dz$. Differentiating w.r.t. $t$:

$$\partial_t p_t(x) = \int \partial_t p_t(x \mid z) p_{data}(z) dz. $$

Applying the conditional continuity equation:

$$\partial_t p_t(x) = -\int \nabla_x \cdot (p_t(x \mid z) v_t(x \mid z)) p_{data}(z) dz.$$


We multiply and divide by $p_t(x)$:

$$
\partial_t p_t(x) = -\int \nabla_x \cdot \left( p_t(x)\dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} v_t(x|z) \right) dz.
$$

Extract the $\nabla_x$:

$$
\partial_t p_t(x) = -\nabla_x \cdot \int p_t(x)\dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} v_t(x|z) dz.
$$

Extract $p_t(x)$:

$$
\partial_t p_t(x) = -\nabla_x \cdot p_t(x) \underbrace{\int \dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} v_t(x|z)  dz}_{v_t(x)}.
$$

This is exactly the marginal continuity equation $\partial_t p_t(x) = -\nabla_x \cdot (p_t(x) v_t(x))$ and therefore:
$$\boxed{v_t(x) = \int \dfrac{p_t(x|z) p_{data}(z)}{p_t(x)} v_t(x|z)  dz}.$$

## Flow Matching Definition

Flow matching formulates generative modeling as an ODE problem. We seek a vector field $v_t$ such that the flow

$$\frac{dx_t}{dt} = v_t(x_t), \quad t \in [0, 1]$$

transports a noise distribution $p_0$ to the data distribution $p_1$.

## How to learn the vector field?

### Marginal Flow Matching (ideal but intractable)

The natural objective is to regress a neural network $v_\theta$ directly onto the marginal vector field:

$$\mathcal{L}_{MFM}(\theta) = \mathbb{E}_{t,\, x_t} \left[ \| v_\theta(x_t, t) - v_t(x_t) \|^2 \right]$$

This is intractable: evaluating $v_t(x_t) = \mathbb{E}_{p_t(z \mid x_t)}[v_t(x_t \mid z)]$ requires integrating over the full data distribution.

### Conditional Flow Matching (practical)

Instead, we regress onto the *conditional* vector field. Sample a data point $x_1 \sim p_{data}$, noise $x_0 \sim p_0$, time $t \sim \text{Uniform}(0,1)$, and form $x_t = (1-t)x_0 + t x_1$:

$$\mathcal{L}_{CFM}(\theta) = \mathbb{E}_{t,\, x_0,\, x_1} \left[ \| v_\theta(x_t, t) - \underbrace{(x_1 - x_0)}_{v_t(x_t | x_1)} \|^2 \right]$$

### Why CFM works: equivalence of minimizers

The two objectives have the same minimizer. For any squared-error objective:

$$\arg\min_f \mathbb{E}\left[\|f(x) - y\|^2\right] = \mathbb{E}[y \mid x]$$

**Proof.** By the law of total expectation:

$$\mathbb{E}[\|f(x) - y\|^2] = \mathbb{E}_x\big[\mathbb{E}_{y \mid x}[\|f(x) - y\|^2]\big]$$

We can minimize pointwise for each $x$. Setting $c = f(x)$:

$$\mathbb{E}_{y \mid x}[\|c - y\|^2] = \|c\|^2 - 2c \cdot \mathbb{E}[y \mid x] + \mathbb{E}[\|y\|^2|x]$$

Differentiating w.r.t. $c$:

$2c - 2\mathbb{E}[y \mid x] = 0$, so $f^*(x) = \mathbb{E}[y \mid x]$. $\square$

Applied here: the minimizer of $\mathcal{L}_{CFM}$ predicts

$$\mathbb{E}[v_t(x_t \mid x_1) \mid x_t] = \mathbb{E}_{p_t(x_1 \mid x_t)}[v_t(x_t \mid x_1)] = v_t(x_t)$$

So training on the easy conditional objective recovers the intractable marginal vector field.

## Rectified Flows (Linear Flows)

The flow matching framework above is general — it works for any choice of probability path $p_t(x \mid z)$ and conditional vector field $v_t(x \mid z)$. Rectified Flow makes the simplest possible choices:

### Specific choices

1. **Linear interpolation path:** $x_t = (1-t)x_0 + t x_1$, a straight line from noise to data.
2. **Constant conditional velocity:** $v_t(x_t \mid x_1) = x_1 - x_0$, which follows directly by differentiating the path.
3. **Independent coupling:** $x_0 \sim \mathcal{N}(0, I)$ and $x_1 \sim p_{data}$ are sampled independently.

### The straightness problem

The conditional paths are straight by construction (each $(x_0, x_1)$ pair travels a straight line). However, the *marginal* flow — what the learned model $v_\theta$ actually computes — can still have curved trajectories. This happens because straight lines from different pairs cross each other, and the model must average over them.

Curved marginal trajectories require many ODE steps to follow accurately. Straighter trajectories can be solved in fewer steps (even a single Euler step).

### Reflow (rectification)

The key idea of Rectified Flow is an iterative straightening procedure:

1. **Train** a flow model $v_\theta$ using the standard CFM objective with independent $(x_0, x_1)$ pairs.
2. **Generate coupled pairs:** sample $x_0 \sim \mathcal{N}(0, I)$, then run the learned ODE forward to get $\hat{x}_1$.
3. **Retrain** on the new pairs $(x_0, \hat{x}_1)$. These pairs are no longer independent — they follow the learned flow, so their straight-line connections cross less.
4. **Repeat.** Each round produces straighter marginal trajectories.

After rectification, the marginal paths are nearly straight, enabling high-quality generation in very few ODE steps (e.g., 1–10 instead of 50+). This is the approach used in **Stable Diffusion 3**.

## DDIM as a Flow

DDIM's deterministic sampler ($\eta = 0$) is a specific instance of flow matching — it uses a **Gaussian probability path** instead of a linear one.

### The Gaussian probability path

DDIM defines the conditional path via:

$$x_t = \alpha_t x_1 + \sigma_t \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)$$

where $\alpha_t$ and $\sigma_t$ are the noise schedule (with $\alpha_0 = 0,\; \sigma_0 = 1$ at the noise end and $\alpha_1 = 1,\; \sigma_1 = 0$ at the data end). This means $p_t(x \mid x_1) = \mathcal{N}(x;\, \alpha_t x_1,\, \sigma_t^2 I)$.

Compare with Rectified Flow's linear path: $x_t = (1-t)x_0 + t x_1$. Both are valid probability paths, but the Gaussian path is **curved** in general (since $\alpha_t$ and $\sigma_t$ need not be linear in $t$).

### The conditional velocity

Differentiating the path w.r.t. $t$:

$$v_t(x_t \mid x_1) = \frac{dx_t}{dt} = \dot{\alpha}_t x_1 + \dot{\sigma}_t \epsilon$$

This is the conditional vector field for DDIM's path. The marginal vector field follows by the same marginalization as before: $v_t(x_t) = \mathbb{E}_{p_t(x_1 \mid x_t)}[v_t(x_t \mid x_1)]$.

### Noise prediction = velocity prediction (reparameterization)

From the path equation, $\epsilon = \frac{x_t - \alpha_t x_1}{\sigma_t}$, so:

$$v_t(x_t \mid x_1) = \dot{\alpha}_t x_1 + \dot{\sigma}_t \cdot \frac{x_t - \alpha_t x_1}{\sigma_t} = \frac{\dot{\sigma}_t}{\sigma_t} x_t + \left(\dot{\alpha}_t - \frac{\alpha_t \dot{\sigma}_t}{\sigma_t}\right) x_1$$

A network predicting any one of $\epsilon$, $x_1$, or $v_t$ can compute the other two given $x_t$ and $t$:

| Prediction target | Notation | Relationship |
| :--- | :--- | :--- |
| **Noise** | $\epsilon_\theta(x_t, t)$ | $\epsilon = \frac{x_t - \alpha_t x_1}{\sigma_t}$ |
| **Data** | $\hat{x}\_{1,\theta}(x_t, t)$ | $x_1 = \frac{x_t - \sigma_t \epsilon}{\alpha_t}$ |
| **Velocity** | $v_\theta(x_t, t)$ | $v_t = \dot{\alpha}_t x_1 + \dot{\sigma}_t \epsilon$ |

These are all linear functions of each other given $(x_t, t)$. The training objectives (noise prediction, velocity prediction) differ only by a time-dependent reweighting.

### Summary

DDIM is flow matching with a Gaussian (curved) probability path. Rectified Flow replaces this with a linear (straight) path. The straighter the path, the fewer ODE steps needed at inference.

## Flow Matching vs. Traditional Diffusion

Flow matching is a unifying framework: traditional diffusion (DDIM) and Rectified Flows are both instances, differing only in the choice of probability path.

| | Traditional Diffusion (DDIM) | Rectified Flow (SD3) |
| :--- | :--- | :--- |
| **Probability path** | Gaussian: $x_t = \alpha_t x_1 + \sigma_t \epsilon$ | Linear: $x_t = (1-t)x_0 + t x_1$ |
| **Path shape** | Curved (schedule-dependent) | Straight |
| **Conditional velocity** | $\dot{\alpha}_t x_1 + \dot{\sigma}_t \epsilon$ | $x_1 - x_0$ (constant) |
| **Training target** | Noise $\epsilon$ (or score $\nabla \log p$) | Velocity $v$ |
| **Inference steps** | Many (50+) to follow curves | Few (1–10) due to straight paths |
| **Noise assumption** | Gaussian required | Any source distribution |
