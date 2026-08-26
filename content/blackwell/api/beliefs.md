---
title: "Beliefs"
description: "Immutable Gaussian and particle belief containers."
weight: 10
draft: false
---

Module: `blackwell.beliefs`

## `GaussianBelief`

```python
class GaussianBelief(NamedTuple):
    mean: Array
    covariance: Array
```

A Gaussian belief with covariance in local tangent coordinates. The container deliberately does not retain a state-space object, keeping it an uncomplicated JAX PyTree.

| Field | Meaning |
| --- | --- |
| `mean` | State array in the accompanying state space. For SE(2), `[x, y, heading]` with shape `(3,)`. |
| `covariance` | Symmetric local covariance with shape `(tangent_dim, tangent_dim)` at `mean`. For SE(2), axes are body-frame `[forward, lateral, turn]`. |

## `ParticleBelief`

```python
class ParticleBelief(NamedTuple):
    particles: Array
    weights: Array
```

A normalised weighted collection of particles.

| Field | Meaning |
| --- | --- |
| `particles` | State samples with shape `(particle_count, *state_shape)`. |
| `weights` | Non-negative, normalised weights with shape `(particle_count,)`. |

The container does not enforce normalisation at construction. Filter operations assume finite weights that sum to one.

[View `beliefs.py` on GitHub](https://github.com/unswei/blackwell/blob/main/src/blackwell/beliefs.py).
