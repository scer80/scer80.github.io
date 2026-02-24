---
layout: contents
---

# Chebyshev's Inequality

### The Formula
Let $X$ be a random variable with finite mean $\mu$ and finite variance $\sigma^2$.
For any real number $\epsilon > 0$:

$$ P(|X - \mu| \ge \epsilon) \le \frac{\sigma^2}{\epsilon^2} $$

---

### The Proof

**Goal:** We want to show that the variance $\sigma^2$ is always greater than or equal to $\epsilon^2$ times the probability of the tail.

**1. Definition of Variance**
By definition, variance is the expected value of the squared deviation:
$$ \sigma^2 = \text{Var}(X) = \int_{-\infty}^{\infty} (x - \mu)^2 f(x) \, dx $$
*(where $f(x)$ is the probability density function)*

**2. Split the Integral**
We split the integral into two regions: the region "close" to the mean ($|x - \mu| < \epsilon$) and the region "far" from the mean ($|x - \mu| \ge \epsilon$).

$$ \sigma^2 = \underbrace{\int_{|x - \mu| < \epsilon} (x - \mu)^2 f(x) \, dx}_{\text{Region A}} + \underbrace{\int_{|x - \mu| \ge \epsilon} (x - \mu)^2 f(x) \, dx}_{\text{Region B}} $$

**3. Apply Inequalities**
*   **Region A:** Since $(x-\mu)^2 \ge 0$ and $f(x) \ge 0$, this entire integral is $\ge 0$. We can drop it and the inequality holds:
    $$ \sigma^2 \ge \int_{|x - \mu| \ge \epsilon} (x - \mu)^2 f(x) \, dx $$

*   **Region B:** Inside this integral, we are only looking at $x$ values where $\lvert x - \mu \rvert \ge \epsilon$. Therefore, $(x - \mu)^2 \ge \epsilon^2$. We can replace the term inside the integral with $\epsilon^2$ to make the integral smaller:
    $$ \sigma^2 \ge \int_{\lvert x - \mu \rvert \ge \epsilon} \epsilon^2 f(x) \, dx $$

**4. Factor and Identify Probability**
Pull the constant $\epsilon^2$ out of the integral:
$$ \sigma^2 \ge \epsilon^2 \underbrace{\int_{|x - \mu| \ge \epsilon} f(x) \, dx}_{\text{This is } P(|X-\mu| \ge \epsilon)} $$

The remaining integral is simply the definition of the probability that $X$ is at least $\epsilon$ away from $\mu$.

$$ \sigma^2 \ge \epsilon^2 \cdot P(|X - \mu| \ge \epsilon) $$

**5. Rearrange**
Divide by $\epsilon^2$:

$$ \frac{\sigma^2}{\epsilon^2} \ge P(|X - \mu| \ge \epsilon) $$

**Q.E.D.**
