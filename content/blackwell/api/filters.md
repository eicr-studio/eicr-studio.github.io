---
title: "Filters"
description: "Extended Kalman and bootstrap particle inference signatures and behaviour."
weight: 40
draft: false
---

## `ExtendedKalmanFilter`

Module: `blackwell.filters.ekf`

```python
@dataclass(frozen=True)
class ExtendedKalmanFilter:
    state_space: StateSpaceOperations
    dynamics: DynamicsOperations
    observation: ObservationOperations
```

Capture an instance in a closure or bind a method before applying `jax.jit`. Model parameter objects remain ordinary dynamic JAX PyTrees.

### `predict`

```python
predict(
    belief: GaussianBelief,
    dynamics_model: object,
    control: Array,
) -> GaussianBelief
```

Propagates the mean, maps prior covariance through the tangent transition Jacobian, adds process covariance and symmetrises the result.

### `update`

```python
update(
    belief: GaussianBelief,
    observation_model: object,
    measurement: Array,
) -> GaussianBelief
```

Forms a model-specific residual, calculates the tangent Kalman gain, retracts the correction, applies the Joseph covariance form and transports covariance to the corrected mean.

### `step`

```python
step(
    belief: GaussianBelief,
    dynamics_model: object,
    observation_model: object,
    control: Array,
    measurement: Array,
) -> GaussianBelief
```

Performs one prediction followed by one update.

## `BootstrapParticleFilter`

Module: `blackwell.filters.particle`

```python
@dataclass(frozen=True)
class BootstrapParticleFilter:
    state_space: StateSpaceOperations
    dynamics: DynamicsOperations
    observation: ObservationOperations
```

### `initialise`

```python
initialise(
    key: Array,
    mean: Array,
    covariance: Array,
    particle_count: int,
) -> ParticleBelief
```

Samples local Gaussian tangents, retracts them onto the state space and assigns uniform weights. `particle_count` must be static under JIT.

### `predict` and `update`

```python
predict(key, belief, dynamics_model, control) -> ParticleBelief
update(belief, observation_model, measurement) -> ParticleBelief
```

`predict` propagates particles with sampled local process noise, retaining prior weights. `update` evaluates Gaussian measurement likelihoods and normalises posterior weights in log space. Observation covariance must be positive definite.

### Diagnostics and resampling

```python
effective_sample_size(belief: ParticleBelief) -> Array
systematic_resample(key: Array, belief: ParticleBelief) -> ParticleBelief
```

Effective sample size is `1 / sum(weights**2)`. Systematic resampling selects particle states from one random offset and resets weights to uniform.

### `step`

```python
step(
    key: Array,
    belief: ParticleBelief,
    dynamics_model: object,
    observation_model: object,
    control: Array,
    measurement: Array,
) -> ParticleBelief
```

Performs propagation and weighting **without resampling**. Apply an explicit ESS policy at the call site.

[View the filter source](https://github.com/unswei/blackwell/tree/main/src/blackwell/filters).
