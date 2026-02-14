---
layout: contents
---

# ODE, SDE and their Inversion

<script type="text/tikz">
\begin{tikzpicture}
  \node[draw, circle, minimum size=2.5cm, thick] (ode) at (0,0) {\Large ODE};
  \node[draw, circle, minimum size=2.5cm, thick] (sde) at (9,0) {\Large SDE};
  \node[above=1.5cm of ode] {$\displaystyle \frac{dx(t)}{dt} = u_t(x(t))$};
  \node[above=1.5cm of sde] {$\displaystyle dx(t) = \left[ u_t + \frac{\sigma_t^2}{2} \nabla \log p_t \right] dt + \sigma_t\, dW_t$};
  \node[below=1.5cm of ode] {$\displaystyle \frac{dx}{dt} = f - \frac{1}{2}\nabla_x(g^2) - \frac{1}{2}g^2 \nabla_x \log p_t$};
  \node[below=1.5cm of sde] {$\displaystyle dx = f(x,t)\,dt + g(x,t)\,dW$};
  \draw[->, very thick, bend left=35] (ode) to (sde);
  \draw[->, very thick, bend left=35] (sde) to (ode);
\end{tikzpicture}
</script>

