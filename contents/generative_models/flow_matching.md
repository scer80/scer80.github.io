---
layout: contents
---

### **1. Content Extraction from the Notes**

**Key Topics:**
*   **Context:** Flow Matching includes **DDIM** and **Rectified Flows** (Linear Flows). It is the foundational technology for **Stable Diffusion 3**.
*   **The Shift:** It moves away from the strict **Gaussian assumption** used in traditional Diffusion.
*   **The ODE Formulation:**
    *   $\frac{dx_t}{dt} = v_t(x_t)$
    *   $x_t$ is defined as the state at time $t$ starting from $x(t=0)$ to $x(t=1)$.
    *   The goal is to learn a mapping/flow: $x_0 \rightarrow x_1$ where $p_0$ (noise) becomes $p_1$ (data).
*   **Goal of Flow Matching:** Find a vector field $v_t$ that generates a flow between noise ($x_0$) and data ($x_1$).
*   **Comparison to DDIM:** Mention of DDIM flow formula: $v_t^{ \* }(x_t) = \frac{1}{2t} \mathbb{E}[x_0 - x_t | x_t]$.
*   **The Problem of Intractability:** The marginal vector field $v_t^*(x_t)$ is hard to compute because it requires knowing the entire distribution.
*   **The Solution (Conditional Flow Matching):**
    *   Instead of matching the full vector field, we choose a "pointwise flow" $v_t^{[x_1, x_0]}$ between a specific noise point $x_0$ and data point $x_1$.
    *   **Simplest Linear Flow:** $v_t^{[x_1, x_0]} = x_1 - x_0$ (Note: Your notes have a small typo/notation swap here; standard linear flow is $x_t = (1-t)x_0 + t x_1$, so the velocity is $x_1 - x_0$).
    *   **Loss Function:** Minimize the distance between a neural network $f(x_t)$ and the conditional vector field:
        $\text{argmin}_f \mathbb{E} \| f(x_t) - v_t^{[x_1, x_0]}(x_t) \|_2^2$
    *   **Crucial Theorem:** Minimizing this conditional objective is equivalent to matching the true marginal vector field: $\mathbb{E}[f(x) - y]^2 \Rightarrow f(x) = \mathbb{E}[y \mid x]$.

---

### **2. Improved & Formalized Explanation**

#### **What is Flow Matching?**
Traditional diffusion models (like SD 1.5/2.1) are stochastic; they follow a "noisy" path. **Flow Matching** is a deterministic approach. It treats generative modeling as an **Ordinary Differential Equation (ODE)** problem. We want to find a "wind" (vector field $v_t$) that blows points from a simple distribution (Gaussian noise) into a complex distribution (real images).

#### **The Core Math**
1.  **The Probability Path:** We define a path $x_t$ that interpolates between noise $x_0$ and data $x_1$.
    *   **Linear Interpolant:** $x_t = (1-t)x_0 + tx_1$
    *   This is the "straight line" that **Rectified Flows** (used in SD3) uses.
    
2.  **The Target Velocity:** If $x_t$ moves in a straight line, its velocity (the derivative with respect to time) is constant:
    $$v_t(x_t) = \frac{dx_t}{dt} = x_1 - x_0$$
    *This is much simpler than diffusion math!*

3.  **The Training Objective:**
    Since we don't know the "true" velocity of the whole distribution, we use **Conditional Flow Matching (CFM)**. We sample a pair $(x_0, x_1)$ and train the model $v_\theta$ to predict the velocity needed to get from that specific $x_0$ to that specific $x_1$:
    $$\mathcal{L}_{CFM}(\theta) = \mathbb{E}_{t, x_0, x_1} [ \| v_\theta(x_t, t) - (x_1 - x_0) \|^2 ]$$

#### **Why is this better? (The SD3 Advantage)**
*   **Straight Paths:** In standard diffusion, the path from noise to data is curved. In Flow Matching (specifically Rectified Flows), the paths are **straighter**. Straight paths are easier to solve, meaning you can generate high-quality images in **fewer steps** (e.g., 10-20 steps instead of 50+).
*   **No Gaussian Requirement:** Unlike diffusion, which relies on adding Gaussian noise, Flow Matching can theoretically work with any source distribution.
*   **Unification:** It proves that DDIM and other samplers are just specific types of "flows."

### **Summary Table**

| Feature | Traditional Diffusion | Flow Matching (SD3) |
| :--- | :--- | :--- |
| **Path** | Curved/Stochastic | Straight/Deterministic (ODE) |
| **Objective** | Predict Noise ($\epsilon$) or Score ($\nabla \log p$) | Predict Velocity ($v$) |
| **Assumption** | Must be Gaussian Noise | Can be arbitrary |
| **Efficiency** | Requires many steps to handle curves | High efficiency due to straight paths |
