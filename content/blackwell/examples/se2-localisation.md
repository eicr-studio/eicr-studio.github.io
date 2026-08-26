---
title: "SE(2) EKF localisation"
description: "Simulate landmark observations and estimate a planar trajectory with the manifold-aware EKF."
weight: 20
draft: false
image: "/images/blackwell/se2-localisation.png"
images:
  - "/images/blackwell/se2-localisation.png"
---

This end-to-end example drives a planar robot on a curved path, simulates range-bearing measurements to known landmarks and estimates the pose with the manifold-aware EKF.

```console
uv run python examples/se2_localisation.py
```

It reports final poses, trajectory position RMSE and mean NEES. To save a plot:

```console
uv run python examples/se2_localisation.py --plot localisation.png
```

![True and estimated SE(2) trajectories with local covariance ellipses](/images/blackwell/se2-localisation.png)

## What to notice

- The simulator and filter share the same state-space and model families.
- True and estimated poses remain state arrays; covariance remains local to each estimated pose.
- `jax.lax.scan` performs the sequential filtering loop.
- Pose error uses `se2.local_coordinates`, not coordinate-wise subtraction.
- Plotted covariance ellipses are rotated from the body tangent frame into the world frame for display.

## Core filtering loop

```python
def update(belief, inputs):
    control, measurement = inputs
    belief = filter_.step(
        belief, dynamics, observation, control, measurement
    )
    return belief, belief

_, beliefs = jax.lax.scan(
    update, initial_belief, (controls, measurements)
)
errors = jax.vmap(se2.local_coordinates)(beliefs.mean, true_poses)
```

[View the complete script](https://github.com/unswei/blackwell/blob/main/examples/se2_localisation.py), read the [EKF guide](/blackwell/guides/extended-kalman-filter/) or learn how to interpret [RMSE and NEES](/blackwell/guides/simulation-and-evaluation/).
