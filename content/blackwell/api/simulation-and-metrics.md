---
title: "Simulation and metrics"
description: "Trajectory simulation, RMSE and normalised estimation error squared."
weight: 50
draft: false
---

## `Simulator`

Module: `blackwell.simulation`

```python
@dataclass(frozen=True)
class Simulator:
    state_space: StateSpaceOperations
    dynamics: DynamicsOperations
    observation: ObservationOperations
```

The simulator propagates a state, applies local process noise, then samples additive measurement noise in flattened measurement coordinates.

### `step`

```python
step(
    key: Array,
    state: Array,
    dynamics_model: object,
    observation_model: object,
    control: Array,
) -> tuple[Array, Array]
```

Returns `(next_state, measurement)`. The key is split once for process and measurement noise.

### `rollout`

```python
rollout(
    key: Array,
    initial_state: Array,
    dynamics_model: object,
    observation_model: object,
    controls: Array,
) -> tuple[Array, Array]
```

Uses `jax.lax.scan` to return `(states, measurements)` with one entry per control. The initial state itself is not included in `states`.

## Metrics

Module: `blackwell.metrics`

### Root mean square error

```python
root_mean_square_error(
    errors: Array,
    axis: int | tuple[int, ...] = 0,
) -> Array
```

Returns component-wise RMSE, preserving axes that are not reduced.

### Planar position RMSE

```python
position_rmse(
    errors: Array,
    axis: int | tuple[int, ...] = 0,
) -> Array
```

Expects tangent errors with planar position in the first two coordinates and returns root mean squared Euclidean position norm.

### NEES

```python
normalised_estimation_error_squared(
    errors: Array,
    covariances: Array,
) -> Array

mean_nees(
    errors: Array,
    covariances: Array,
    axis: int | tuple[int, ...] = 0,
) -> Array
```

`errors` has shape `(..., tangent_dim)` and matching nonsingular covariances have shape `(..., tangent_dim, tangent_dim)`. NEES output has shape `errors.shape[:-1]`; `mean_nees` averages it over selected sample axes.

[View simulation](https://github.com/unswei/blackwell/blob/main/src/blackwell/simulation.py) and [metrics](https://github.com/unswei/blackwell/blob/main/src/blackwell/metrics.py) source.
