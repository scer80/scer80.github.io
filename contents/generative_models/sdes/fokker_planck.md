---
layout: contents
---

# Fokker-Planck Equation

The Fokker-Planck equation is the analogue of the continuity equation for SDEs.

## Preliminaries

- **Markovianity**
    - for $t_1 > t_2 > t_3$ and any $x_1, x_2, x_3$
    $$P(x_1, t_1 \mid x_2, t_2, x_3, t_3) = P(x_1, t_1 \mid x_2, t_2)$$
    $$\Rightarrow P(x_1, t_1 \mid x_3, t_3) = \int_{x_2} P(x_1, t_1 \mid x_2, t_2) P(x_2, t_2 \mid x_3, t_3) dx_2$$

- **Time Homogeneous**
    - $P(x_1, t_1+s; x_2, t_2+s) = P(x_1, t_1, x_2, t_2)$ (invariant to time shifts)
    $$P(x_1, t_1 \mid x_2, t_2) = P(x_1, t_1 - t_2 \mid x_2, 0)$$

- **Test Function $h(x)$**
    - smooth
    - compact support
    - **Taylor Expansion**
    $$h(y) = \sum_{n=0}^{\infty} \frac{h^{(n)}(x)}{n!} (y-x)^n = h(x) + h'(x)(y-x) + \frac{h''(x)}{2}(y-x)^2 + \dots$$

## Derivation

Definition of the derivative of $p(y, t \mid x)$ with respect to $t$:

$$\int\limits_{-\infty}^{\infty} h(y) \frac{\partial p(y, t \mid x)}{\partial t} dy = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int\limits_{-\infty}^{\infty} h(y) [p(y, t + \Delta t \mid x) - p(y, t \mid x)] dy = \otimes$$

Split into two integrals:
$$\otimes = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \left[ \int\limits_{-\infty}^{\infty} h(y) p(y, t + \Delta t \mid x) dy - \int\limits_{-\infty}^{\infty} h(y) p(y, t \mid x) dy \right]$$

Use the Chapman-Kolmogorov equation $p(y, t + \Delta t \mid x) = \int_z p(y, \Delta t \mid z) p(z, t \mid x) dz$ on the first integral:

$$\otimes = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \left[ \iint_{y,z} h(y)\, p(y, \Delta t \mid z)\, p(z, t \mid x)\, dy\, dz - \int_y h(y)\, p(y, t \mid x)\, dy \right]$$

In the second integral, rename dummy variable $y \to z$:
$$\otimes = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \left[ \int_z p(z, t \mid x) \int_y h(y)\, p(y, \Delta t \mid z)\, dy\, dz - \int_z h(z)\, p(z, t \mid x)\, dz \right]$$

Factor out $\int_z p(z, t \mid x) [\cdots]\, dz$:
$$\otimes = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int_z p(z, t \mid x) \left[ \int_y h(y)\, p(y, \Delta t \mid z)\, dy - h(z) \right] dz$$

Expand $h(y)$ around $z$:
$$h(y) = h(z) + h'(z)(y-z) + \frac{1}{2}h''(z)(y-z)^2 + \dots$$
$$h(y) = \sum_{n=0}^{\infty} \frac{1}{n!} h^{(n)}(z) (y-z)^n$$

Define the **Kramers-Moyal coefficients**:
$$\boxed{D_n(z) = \frac{1}{n!} \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int_y (y-z)^n p(y, \Delta t \mid z) dy}$$

Substitute the Taylor expansion of $h(y)$ around $z$ into the integral:
$$
\otimes = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int_z p(z, t \mid x) \left[ \int_y \underbrace{h(y)}_{h(z) + \sum_{n=1}^{\infty} \frac{1}{n!} h^{(n)}(z) (y-z)^n}\, p(y, \Delta t \mid z)\, dy - h(z) \right] dz
$$

$$
\otimes = \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int_z p(z, t \mid x) \left[ \underbrace{\int_y h(z) p(y, \Delta t \mid z) dy}_{h(z)} + \sum_{n=1}^{\infty} \frac{1}{n!} h^{(n)}(z) \int_y (y-z)^n p(y, \Delta t \mid z) dy - h(z) \right] dz
$$

The $h(z)$ terms cancel out:
$$\otimes = \int_z p(z, t \mid x) \sum_{n=1}^{\infty} h^{(n)}(z) \left[ \frac{1}{n!} \lim_{\Delta t \to 0} \frac{1}{\Delta t} \int_y (y-z)^n p(y, \Delta t \mid z) dy \right] dz$$
$$\otimes = \int_z p(z, t \mid x) \sum_{n=1}^{\infty} h^{(n)}(z) D_n(z) dz = \int_z \left[ \sum_{n=1}^{\infty} D_n(z) p(z, t \mid x) \right] h^{(n)}(z) dz$$

**Integration by Parts**

Remember:
$$
\otimes = \int\limits_{-\infty}^{\infty} h(y) \frac{\partial p(y, t \mid x)}{\partial t} dy = \sum _{n=1}^{\infty} \int\limits_{-\infty}^{\infty} h^{(n)}(z) D_n(z) p(z, t \mid x) dz
$$
Using the identity $\int u v^{(n)} dx = (-1)^n \int u^{(n)} v dx$ (with vanishing boundary terms due to the compact support of $h(z)$):
$$\int h(y) \frac{\partial p(y, t \mid x)}{\partial t} dy = \sum_{n=1}^{\infty} \int h(z) (-1)^n \frac{\partial^n}{\partial z^n} \left[ D_n(z) p(z, t \mid x) \right] dz$$

Since this must hold for any test function $h(z)$, we can drop the integral and the test function:

$$\boxed{\frac{\partial p(y, t \mid x)}{\partial t} = \sum_{n=1}^{\infty} (-1)^n \frac{\partial^n}{\partial y^n} \left[ D_n(y) p(y, t \mid x) \right]}$$

This is the general **Kramers-Moyal expansion**. 

## Fokker Planck Equation

If only $D_1$ (drift) and $D_2$ (diffusion) are non-zero, it is the Fokker-Planck equation:

$$\boxed{\frac{\partial p(y, t \mid x)}{\partial t} = -\frac{\partial}{\partial y}[D_1(y)\, p(y, t \mid x)] + \frac{\partial^2}{\partial y^2}[D_2(y)\, p(y, t \mid x)]}$$
