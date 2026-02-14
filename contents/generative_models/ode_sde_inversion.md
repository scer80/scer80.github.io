---
layout: contents
---

# ODE, SDE and their Inversion

<script type="text/tikz">
\begin{tikzpicture}[every node/.style={font=\large}]
  \node[draw, circle, minimum size=3cm, thick, font=\LARGE] (ode) at (0,0) {ODE};
  \node[draw, circle, minimum size=3cm, thick, font=\LARGE] (sde) at (10,0) {SDE};
  \node[above=1.8cm of ode] {$\displaystyle \large \frac{dx(t)}{dt} = u_t(x(t))$};
  \node[above=1.8cm of sde] {$\displaystyle \large dx(t) = \left[ u_t + \frac{\sigma_t^2}{2} \nabla \log p_t \right] dt + \sigma_t\, dW_t$};
  \node[below=1.8cm of ode] {$\displaystyle \large \frac{dx}{dt} = f(x,t) - \frac{1}{2}g(t)^2 \nabla_x \log p_t$};
  \node[below=1.8cm of sde] {$\displaystyle \large dx = f(x,t)\,dt + g(t)\, dW$};
  \draw[->, very thick, bend left=35] (ode) to (sde);
  \draw[->, very thick, bend left=35] (sde) to (ode);
\end{tikzpicture}
</script>

