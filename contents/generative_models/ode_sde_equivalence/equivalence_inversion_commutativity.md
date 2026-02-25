---
layout: contents
---

# ODE-SDE Equivalence: Inversion and Commutativity

## Does Inversion Commute with SDE Equivalence?

We have two operations:
1. **ODE Inversion**: Reverse the ODE in time (negate drift, flip time)
2. **SDE Equivalence**: Convert an ODE to an SDE that generates the same probability path

The question is: does the order of these operations matter?

$$\text{Inverse}(\text{SDE-Equiv}(\text{ODE})) \overset{?}{=} \text{SDE-Equiv}(\text{Inverse}(\text{ODE}))$$

## Path 1: ODE → Invert → SDE Equivalence

**Step 1.** Start with ODE:
$$\frac{dx}{dt} = u_t(x)$$

**Step 2.** Invert the ODE (see [ODE Inversion](../odes/inversion.md)):
$$\frac{dx}{du} = -u_{T-u}(x) \tag{inverted ODE}$$

**Step 3.** Apply the equivalence theorem to the inverted ODE (see [Equivalence Theorem](equivalence_theorem)) with noise schedule $\sigma_u$:
$$dx = \left[ -u_{T-u}(x) + \frac{\sigma_{T-u}^2}{2} \nabla \log p_{T-u}(x) \right] du + \sigma_{T-u}\, dW_u$$

Change variables back to $t = T - u$ ($du = -dt$). For the stochastic term, use a reversed-time Brownian motion $\bar W_t$:
$$dx = \left[ u_t(x) - \frac{\sigma_t^2}{2} \nabla \log p_t(x) \right] dt + \sigma_t\, d\bar W_t$$

$$dx = \left[ u_t(x) - \frac{\sigma_t^2}{2} \nabla \log p_t(x) \right] dt + \sigma_t\, d\bar W_t \tag{Path 1 Result}$$

## Path 2: ODE → SDE Equivalence → Invert

**Step 1.** Start with ODE:
$$\frac{dx}{dt} = u_t(x)$$

**Step 2.** Apply the equivalence theorem to get the SDE equivalent:
$$dx = \left[ u_t(x) + \frac{\sigma_t^2}{2} \nabla \log p_t(x) \right] dt + \sigma_t\, dW_t \tag{forward SDE}$$

**Step 3.** Invert the SDE (see [SDE Inversion](../sdes/wp_inversion.md)):

Using the reverse-time drift formula with $f(x,t) = u_t(x) + \frac{\sigma_t^2}{2} \nabla \log p_t(x)$ and $g(t) = \sigma_t$:
$$f_{\text{rev}}(x, u) = -f(x, T-u) + \frac{1}{2}\sigma_{T-u}^2 \nabla \log p_{T-u}(x) + \frac{1}{2}\sigma_u^2 \nabla \log p_{T-u}(x)$$

For time-symmetric noise $\sigma_t = \sigma_{T-t}$, we have $\sigma_u = \sigma_{T-u}$:
$$f_{\text{rev}}(x, u) = -f(x, T-u) + \sigma_{T-u}^2 \nabla \log p_{T-u}(x)$$

Substituting $f(x, t) = u_t(x) + \frac{\sigma_t^2}{2} \nabla \log p_t(x)$:
$$f_{\text{rev}}(x, u) = -\left[ u_{T-u}(x) + \frac{\sigma_{T-u}^2}{2} \nabla \log p_{T-u}(x) \right] + \sigma_{T-u}^2 \nabla \log p_{T-u}(x)$$

$$f_{\text{rev}}(x, u) = -u_{T-u}(x) + \frac{\sigma_{T-u}^2}{2} \nabla \log p_{T-u}(x)$$

Change variables back to $t = T - u$:
$$f_{\text{rev}}(x, t) = -u_t(x) + \frac{\sigma_t^2}{2} \nabla \log p_t(x)$$

The reverse SDE is:
$$dx = \left[ -u_t(x) + \frac{\sigma_t^2}{2} \nabla \log p_t(x) \right] dt + \sigma_t\, d\bar W_t$$

Reparameterize with forward time $\tau = T - t$ and rename $\tau \mapsto t$. The drift becomes:
$$-f_{\text{rev}}(x, T-t) = u_t(x) - \frac{\sigma_t^2}{2} \nabla \log p_t(x)$$

So in forward-time coordinates:
$$dx = \left[ u_t(x) - \frac{\sigma_t^2}{2} \nabla \log p_t(x) \right] dt + \sigma_t\, d\bar W_t \tag{Path 2 Result}$$

## Conclusion

Both paths yield the same result (up to Brownian-motion relabeling):

$$\boxed{dx = \left[ u_t(x) - \frac{\sigma_t^2}{2} \nabla \log p_t(x) \right] dt + \sigma_t\, d\bar W_t}$$

**Inversion and SDE equivalence commute.** This is because:
1. ODE inversion simply negates and time-flips the drift
2. The SDE equivalence theorem adds a score term that depends on the density $p_t$
3. Time reversal transforms drift and score terms consistently, and the stochastic term is represented by a reversed-time Brownian motion
