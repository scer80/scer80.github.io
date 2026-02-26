---
layout: contents
---

# Rectified Flow

Rectified Flow is a specific instance of flow matching where the conditional path is chosen to be linear in time.

## Setup

Choose paired samples $(x_0, x_1)$ (typically $x_0 \sim \mathcal N(0,I)$ and $x_1 \sim p_{\text{data}}$), and define

$$x_t = (1-t)x_0 + t x_1,\qquad t\in[0,1].$$

Differentiating gives the conditional velocity:

$$v_t(x_t\mid x_0,x_1)=x_1-x_0,$$

which is constant in $t$.

Training uses the standard conditional flow-matching regression from [Learning Objective](learning_objective):

$$\min_\theta \mathbb E\left[\left\|v_\theta(x_t,t)-(x_1-x_0)\right\|^2\right].$$

## Why "Rectified"

Each conditional trajectory is straight, but the learned marginal field can still be curved because many different pairs contribute at the same $(x,t)$.

Rectification (reflow) iteratively reduces that curvature:

1. Train a flow model on initial pairs.
2. Sample $x_0$, push it through the learned ODE to get $\hat x_1$.
3. Rebuild pairs as $(x_0,\hat x_1)$ and retrain.
4. Repeat.

Empirically, this makes trajectories straighter and reduces required ODE steps at inference.

## Relation to Diffusion/DDIM

Diffusion models usually use a Gaussian (curved) path, while Rectified Flow uses a linear path.

- DDIM ($\eta=0$): deterministic ODE sampler for a diffusion path.
- Rectified Flow: trains directly on a linear path and its velocity field.

Both are flow-based samplers; they differ mainly in path choice and target parameterization.
