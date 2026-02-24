---
layout: contents
---

# Markov chain inversion is Markovian

- Markov chain: $x_0 \rightarrow x_1 \rightarrow x_2$
- Markov property: $p(x_2 \mid x_1, x_0) = p(x_2 \mid x_1)$

**Theorem.** $p(x_0 \mid x_1, x_2) = p(x_0 \mid x_1)$

i.e. knowing $x_2$ adds nothing about $x_0$ if you already know $x_1$.

*Proof.* Bayes on the left-hand side:

$$p(x_0 \mid x_1, x_2) = \frac{p(x_1, x_2 \mid x_0)\, p(x_0)}{p(x_1, x_2)}$$

- Numerator: $p(x_1, x_2 \mid x_0) = p(x_2 \mid x_1) \cdot p(x_1 \mid x_0)$ by Markov
- Denominator: $p(x_1, x_2) = p(x_2 \mid x_1) \cdot p(x_1)$

The $p(x_2 \mid x_1)$ cancels, leaving $\frac{p(x_1 \mid x_0)\, p(x_0)}{p(x_1)} = p(x_0 \mid x_1)$. $\square$

**Intuition:** the future $x_2$ only "talks to" $x_0$ through $x_1$, so once you condition on $x_1$, $x_2$ is redundant. Extends by induction to longer chains.
