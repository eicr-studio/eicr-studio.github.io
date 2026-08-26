---
title: "Models"
description: "Linear models, SE(2) body motion and known-landmark range-bearing observations."
weight: 30
draft: false
---

## Linear dynamics and observations

Module: `blackwell.models.linear`

```python
class LinearDynamics(NamedTuple):
    transition: Array
    control: Array
    process_covariance: Array

class LinearObservation(NamedTuple):
    observation: Array
    measurement_covariance: Array
```

`LinearDynamics` implements

\[
x_{k+1} = A x_k + B u_k,
\]

with `transition` shape `(state_dim, state_dim)`, `control` shape `(state_dim, control_dim)` and process covariance shape `(state_dim, state_dim)`.

`LinearObservation` predicts `observation @ state`, with matrix shape `(measurement_dim, state_dim)` and covariance shape `(measurement_dim, measurement_dim)`.

```python
propagate(state, control, model) -> Array
transition_jacobian(state, control, model) -> Array
process_covariance(state, control, model) -> Array
observe(state, model) -> Array
observation_jacobian(state, model) -> Array
measurement_covariance(state, model) -> Array
measurement_residual(measurement, expected, model) -> Array
```

The Jacobians and covariances are the stored constant matrices; the residual is `measurement - expected`.

## SE(2) body motion

Module: `blackwell.models.se2`

```python
class BodyMotion(NamedTuple):
    process_covariance: Array

propagate(state: Array, control: Array, model: BodyMotion) -> Array
transition_jacobian(state: Array, control: Array, model: BodyMotion) -> Array
process_covariance(state: Array, control: Array, model: BodyMotion) -> Array
```

`control` is a body tangent increment `[forward, lateral, turn]`. The `(3, 3)` process covariance is expressed in post-motion body tangent coordinates. `propagate` applies right retraction; the transition Jacobian follows the same right-invariant convention.

## Known-landmark range-bearing

Module: `blackwell.models.range_bearing`

```python
class KnownLandmarksRangeBearing(NamedTuple):
    landmarks: Array
    measurement_covariance: Array
```

`landmarks` has shape `(landmark_count, 2)` in the world frame. The per-landmark covariance has shape `(2, 2)` for `[range, bearing]`; bearing units are radians.

```python
observe(state: Array, model: KnownLandmarksRangeBearing) -> Array
observation_jacobian(state: Array, model: KnownLandmarksRangeBearing) -> Array
measurement_covariance(state: Array, model: KnownLandmarksRangeBearing) -> Array
measurement_residual(measurement, expected, model) -> Array
```

- `observe` returns shape `(landmark_count, 2)` with bearings wrapped to `[-pi, pi]`.
- `observation_jacobian` returns shape `(landmark_count, 2, 3)` with tangent axes `[forward, lateral, turn]`.
- `measurement_covariance` returns a block-diagonal matrix with shape `(2 * landmark_count, 2 * landmark_count)`.
- `measurement_residual` wraps the bearing column across the principal-angle cut.

The observation and Jacobian are singular for a landmark exactly coincident with the robot position.

[View the model source](https://github.com/unswei/blackwell/tree/main/src/blackwell/models).
