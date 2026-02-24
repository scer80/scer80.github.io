---
layout: contents
---

# Mean and Variance Dynamical Equations

For a linear SDE $dx = f(t)\,x\,dt + g(t)\,dW_t$ (drift linear in $x$, diffusion depending only on $t$), the conditional mean $m_t = \mathbb{E}[x_t \mid x_0]$ and variance $v_t = \text{Var}(x_t \mid x_0)$ satisfy closed-form ODEs.

## Mean: $\dot{m}_t = f(t)\,m_t$

Take expectations of the SDE. Since $\mathbb{E}[dW_t] = 0$:

$$dm_t = \mathbb{E}[f(t)\,x_t\,dt + g(t)\,dW_t] = f(t)\,m_t\,dt$$

$$\boxed{\dot{m}_t = f(t)\,m_t}, \qquad m_0 = x_0$$

with solution $m_t = e^{\int\limits_0^t f(s)\,ds}\, x_0$.

## Variance: $\dot{v}_t = 2f(t)\,v_t + g^2(t)$

Apply Ito's lemma to $F(x) = x^2$, with $F' = 2x$ and $F'' = 2$:

$$d(x_t^2) = \left(2x_t \cdot f(t)\,x_t + \tfrac{1}{2} \cdot 2 \cdot g^2(t)\right)dt + 2x_t\,g(t)\,dW_t$$

Take expectations (the $dW_t$ term vanishes):

$$\frac{d}{dt}\mathbb{E}[x_t^2] = 2f(t)\,\mathbb{E}[x_t^2] + g^2(t)$$

Since $v_t = \mathbb{E}[x_t^2] - m_t^2$:

$$\dot{v}_t = \frac{d}{dt}\mathbb{E}[x_t^2] - 2m_t\dot{m}_t = 2f(t)\,\mathbb{E}[x_t^2] + g^2(t) - 2f(t)\,m_t^2 = 2f(t)\,v_t + g^2(t)$$

$$\boxed{\dot{v}_t = 2f(t)\,v_t + g^2(t)}, \qquad v_0 = 0$$

These two ODEs fully determine the Gaussian transition kernel of the linear SDE: $p_t(x \mid x_0) = \mathcal{N}(m_t,\, v_t)$.
