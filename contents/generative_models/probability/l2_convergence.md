---
layout: contents
---

# L2 Convergence

## Definition

Let $X_1, X_2, \ldots$ be a sequence of random variables and $X$ be a target random variable. We assume all variables have finite variance ("finite energy").

The sequence $X_n$ converges to $X$ in $L^2$ if:

$$ \lim_{n \to \infty} \mathbb{E}\big[ |X_n - X|^2 \big] = 0 $$

### Notation
*   $X_n \xrightarrow{L^2} X$
*   $X_n \xrightarrow{m.s.} X$ (Mean Square)
*   $\text{l.i.m.}_{n \to \infty} X_n = X$ (Limit in Mean)

## Why is it a "Strong" Convergence?

$L^2$ convergence directly controls the probability that $X_n$ differs from $X$. By Chebyshev’s inequality, for any threshold $\epsilon > 0$:

$$ P(|X_n - X| \ge \epsilon) \le \frac{\mathbb{E}[|X_n - X|^2]}{\epsilon^2} $$

The numerator is exactly the $L^2$ error, which goes to $0$ by assumption. The right-hand side therefore goes to $0$ for any fixed $\epsilon$, and so does the left-hand side. The probability that $X_n$ and $X$ differ by more than $\epsilon$ vanishes as $n \to \infty$.

---

## What $L^2$ Does (and Doesn't) Do

### What it Guarantees (The Moments)
If $X_n \xrightarrow{L^2} X$, then the essential statistics converge:
1.  **Mean:** $\mathbb{E}[X_n] \to \mathbb{E}[X]$
2.  **Variance:** $\text{Var}(X_n) \to \text{Var}(X)$
3.  **Second Moment:** $\mathbb{E}[X_n^2] \to \mathbb{E}[X^2]$

### Where it Fails (The Pathwise Trap)
$L^2$ convergence does **not** imply that individual paths $X_n(\omega)$ settle down — a sequence can converge in $L^2$ while every single path oscillates forever.

