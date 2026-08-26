---
title: "Concepts"
description: "The geometry, uncertainty and JAX execution model behind Blackwell."
weight: 20
draft: false
---

Blackwell separates geometry, uncertainty models and inference so each part can be transformed and tested independently.

```text
state space ── retract / local coordinates / covariance transport
     │
     ├── dynamics model ── propagate / transition Jacobian / process noise
     ├── observation model ── observe / residual / Jacobian / measurement noise
     │
     └── filter ── prediction / update / resampling
```

Read these pages in order if manifold-aware estimation is new to you.
