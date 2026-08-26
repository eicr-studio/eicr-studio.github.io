---
title: "Linear Kalman filter"
description: "Track one-dimensional position and velocity with linear Euclidean models."
weight: 10
draft: false
---

The generic EKF becomes the ordinary discrete Kalman filter when paired with Euclidean geometry and linear models. This example tracks one-dimensional position and velocity from noisy position measurements.

```console
uv run python examples/linear_kalman_filter.py
```

Expected output is similar to:

```text
Final [position, velocity]: [3.7256737  0.91042304]
Final covariance:
 [[0.16104065 0.06601974]
  [0.06601974 0.10097054]]
```

## Model and scan

```python
filter_ = ExtendedKalmanFilter(euclidean, linear, linear)
dynamics = linear.LinearDynamics(
    transition=jnp.array([[1.0, 1.0], [0.0, 1.0]]),
    control=jnp.array([[0.5], [1.0]]),
    process_covariance=jnp.diag(jnp.array([0.02, 0.04])),
)
observation = linear.LinearObservation(
    observation=jnp.array([[1.0, 0.0]]),
    measurement_covariance=jnp.array([[0.25]]),
)

def update(belief, inputs):
    control, measurement = inputs
    belief = filter_.step(
        belief, dynamics, observation, control, measurement
    )
    return belief, belief

final_belief, history = jax.lax.scan(
    update, initial_belief, (accelerations, positions)
)
```

Transition, control and observation matrices are ordinary JAX arrays. The configured filter is carried through `jax.lax.scan`, making the entire time series one compiled computation.

[View the complete script](https://github.com/unswei/blackwell/blob/main/examples/linear_kalman_filter.py) or continue with the [EKF guide](/blackwell/guides/extended-kalman-filter/).
