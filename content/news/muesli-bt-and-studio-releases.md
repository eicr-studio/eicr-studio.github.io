---
title: "muesli-bt v0.4.0 and muesli-studio v0.2.0 released"
description: "New releases add bounded-time planning, replay and inspection capabilities for robotics behaviour systems."
summary: "New runtime, replay and inspection capabilities for inspectable robot behaviour systems."
date: 2026-03-18
draft: false
---

We have released **muesli-bt v0.4.0** and **muesli-studio v0.2.0**.

[muesli-bt](/projects/muesli-bt/) is a compact Lisp runtime for robotics with an integrated Behaviour Tree engine, bounded-time planning and asynchronous capability orchestration. It combines explicit tick semantics, canonical event logging, deterministic fixtures and conformance checks across core, simulator and ROS 2-backed paths. Optional CMake exports are available for PyBullet, Webots and an initial ROS 2 transport lane.

**muesli-studio** is the companion inspector for replay and live monitoring. It uses the same canonical event stream for both recorded and live runs, and includes run summaries, node inspection, blackboard diffs, presentation mode and export paths for figures and compact publication bundles.

[Read the documentation](https://unswei.github.io/muesli-bt/) · [muesli-bt source code](https://github.com/unswei/muesli-bt/) · [muesli-studio source code](https://github.com/unswei/muesli-studio/)
