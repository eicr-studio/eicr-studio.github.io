---
title: "Custom models"
description: "Implement dynamics and observation families without inheritance or registration."
weight: 40
draft: false
---

Blackwell uses structural operation families rather than an inheritance tree. A custom model is an immutable parameter PyTree plus pure functions with the documented names and signatures.

## Dynamics contract

Create a module—for example `random_walk.py`—with three operations:

```python
from typing import NamedTuple

import jax.numpy as jnp
from jax import Array


class RandomWalk(NamedTuple):
    process_covariance: Array


def propagate(state: Array, control: Array, model: RandomWalk) -> Array:
    del model
    return state + control


def transition_jacobian(
    state: Array, control: Array, model: RandomWalk
) -> Array:
    del control, model
    return jnp.eye(state.shape[0], dtype=state.dtype)


def process_covariance(
    state: Array, control: Array, model: RandomWalk
) -> Array:
    del state, control
    return model.process_covariance
```

| Operation | Required result |
| --- | --- |
| `propagate` | Deterministic next state |
| `transition_jacobian` | Derivative from prior tangent error to next tangent error |
| `process_covariance` | Local covariance at the propagated state |

For a Euclidean state the tangent is the state vector. On a manifold, the Jacobian and covariance must follow that state space's retraction convention.

## Observation contract

An observation family provides four operations:

```python
observe(state, model) -> expected_measurement
observation_jacobian(state, model) -> jacobian
measurement_covariance(state, model) -> covariance
measurement_residual(measurement, expected, model) -> residual
```

The EKF flattens the residual and reshapes the Jacobian to `(measurement_dim, tangent_dim)`. The particle filter flattens one residual per particle and expects covariance to match the flattened measurement.

Define `measurement_residual` even when it is simple subtraction. It is the place to handle periodic angles, quaternions or other measurement topology.

## Configure without registration

```python
from blackwell.filters.ekf import ExtendedKalmanFilter
from blackwell.models import linear
from blackwell.spaces import euclidean

import random_walk

filter_ = ExtendedKalmanFilter(euclidean, random_walk, linear)
dynamics = random_walk.RandomWalk(process_covariance=process_covariance)
next_belief = filter_.predict(belief, dynamics, control)
```

There is no registry, base class or plugin hook.

## Validate a family

Test:

1. every returned shape and dtype;
2. JIT compilation with realistic parameter containers;
3. analytical Jacobians against `jax.jacfwd` away from singularities;
4. zero-noise and deterministic cases;
5. residual behaviour at topology boundaries; and
6. simulation and filter agreement about covariance coordinates.

<div class="blackwell-docs-note">
<p><strong>Static Python, dynamic arrays.</strong> Keep callables in the operation module captured by the configured filter. Keep runtime arrays in a <code>NamedTuple</code>, registered dataclass or another standard PyTree.</p>
</div>

The [linear and nonlinear model API](/blackwell/api/models/) provides compact reference implementations.
