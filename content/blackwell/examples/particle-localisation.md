---
title: "SE(2) particle localisation"
description: "Estimate a planar trajectory with weighted particles and adaptive systematic resampling."
weight: 30
draft: false
image: "/images/blackwell/particle-localisation.png"
images:
  - "/images/blackwell/particle-localisation.png"
---

This example estimates a planar trajectory with a bootstrap particle filter. It starts with 500 local samples, updates weights from landmark observations and resamples when effective sample size falls below half the population.

```console
uv run python examples/particle_localisation.py
```

Save a plot with:

```console
uv run python examples/particle_localisation.py --plot particles.png
```

![True and particle-filter trajectories with the final particle cloud](/images/blackwell/particle-localisation.png)

The displayed pose estimate uses weighted translation and a circular heading mean. The particle cloud—not that summary—is the posterior representation.

## Explicit resampling policy

```python
weighted = filter_.step(
    prediction_key, belief, dynamics, observation, control, measurement
)
estimate = weighted_pose(weighted)
belief = jax.lax.cond(
    filter_.effective_sample_size(weighted) < particle_count / 2,
    lambda candidate: filter_.systematic_resample(
        resampling_key, candidate
    ),
    lambda candidate: candidate,
    weighted,
)
```

[View the complete script](https://github.com/unswei/blackwell/blob/main/examples/particle_localisation.py) or continue with the [particle-filter guide](/blackwell/guides/particle-filter/).
