---
layout: contents
---

# Score Matching

(Hyvärinen: Estimation of Non-Normalized Statistical Models by Score Matching)

## Setup

Data $x \sim p(x)$. Model $p_{\theta}(x) = \frac{f_{\theta}(x)}{Z(\theta)}$ where $f_{\theta}(x) > 0$ and $Z(\theta) = \int f_{\theta}(x) \, dx$.

Key insight — the score doesn't need $Z(\theta)$:

$$ \nabla_x \log p_{\theta}(x) = \nabla_x \log f_{\theta}(x) - \underbrace{\nabla_x \log Z(\theta)}_{=0} = \nabla_x \log f_{\theta}(x) $$

## Score Matching Objective

$$ J(\theta) = \frac{1}{2} \int p(x) \| \nabla_x \log p(x) - \nabla_x \log f_{\theta}(x) \|^2 \, dx $$

- $J(\theta) \ge 0$ for all $\theta$
- $J(\theta^{\*}) = 0 \Leftrightarrow p(x) = p_{\theta^{\*}}(x)$

**Why $J = 0$ recovers the true model:** all terms under the integral are non-negative, so $J = 0$ implies $\nabla_x \log p(x) = \nabla_x \log f_{\theta}(x)$ everywhere, hence $\log p(x) = \log f_{\theta}(x) + C$, i.e. $p(x) = e^C f_{\theta}(x) = p_{\theta}(x)$.

## Integration by Parts Trick

$J(\theta)$ still contains the unknown $p(x)$ inside the norm. Expand:

$$ J(\theta) = \frac{1}{2} \int p(x) \| \nabla_x \log p(x) \|^2 \, dx + \frac{1}{2} \int p(x) \| \nabla_x \log f_{\theta}(x) \|^2 \, dx - \int p(x) (\nabla_x \log p(x))^T (\nabla_x \log f_{\theta}(x)) \, dx $$

- First term: does not depend on $\theta$, drop for optimization.
- Cross term: rewrite $\nabla_x \log p(x) = \frac{\nabla_x p(x)}{p(x)}$, the $p(x)$ cancels:

$$ \int p(x) \sum_i \frac{1}{p(x)} \frac{\partial p(x)}{\partial x_i} \frac{\partial \log f_{\theta}(x)}{\partial x_i} \, dx = \sum_i \int \frac{\partial p(x)}{\partial x_i} \frac{\partial \log f_{\theta}(x)}{\partial x_i} \, dx $$

Integration by parts ($\int f g' = fg - \int f' g$), with $f = \frac{\partial}{\partial x_i} \log f_\theta$, $g' = \frac{\partial p}{\partial x_i}$ (so $g = p$):

$$ = \sum_i \left[ \underbrace{p(x) \frac{\partial \log f_{\theta}(x)}{\partial x_i} \bigg|_{-\infty}^{\infty}}_{\to 0} - \int p(x) \frac{\partial^2 \log f_{\theta}(x)}{\partial x_i^2} \, dx \right] $$

Boundary term vanishes (assuming $p(x) \to 0$ fast enough at $\pm\infty$).

## Final Result

Dropping the constant first term, the practical objective is:

$$ \tilde{J}(\theta) = \int p(x) \sum_i \left[ \frac{1}{2} \left( \frac{\partial \log f_{\theta}(x)}{\partial x_i} \right)^2 + \frac{\partial^2 \log f_{\theta}(x)}{\partial x_i^2} \right] dx $$

- Only requires $f_{\theta}$ and its derivatives — no $Z(\theta)$, no $p(x)$ in explicit form
- The expectation over $p(x)$ is estimated from samples
