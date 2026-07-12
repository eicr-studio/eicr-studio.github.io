---
title: "muesli-bt"
date: 2026-02-08T17:24:00+11:00
summary: "muesli-bt is a small Lisp-based runtime for robotics behaviour systems."
thumbnail: "/images/muesli-bt_150.png"
---

## Problem

Robot behaviour systems need to remain inspectable and predictable when planning, asynchronous calls and integration with a host application happen together. muesli-bt addresses that problem with a small Lisp at the centre, used to author behaviour trees that run inside a host robot application.

## Status

muesli-bt v0.4.0 and muesli-studio v0.2.0 are available as open-source releases.

## Approach

It is old-school in how you write behaviours (simple, explicit, hackable), but paired with more contemporary runtime expectations like inspection-ready logs, deterministic replay, and clear tick and deadline semantics.

Technically, muesli-bt is an embeddable runtime for Lisp-authored behaviour trees, with bounded-time planning during ticks and explicit async calls (including cancellation and safe fallback patterns). It is designed to integrate cleanly into C++ hosts and to support tooling that can inspect, replay, and debug real robot runs.

## Results and outputs

<div class="project-actions">
  <a class="content-action" href="https://unswei.github.io/muesli-bt/">Read the documentation</a>
  <a class="content-action content-action-secondary" href="https://github.com/unswei/muesli-bt">View the source code</a>
  <a class="content-action content-action-secondary" href="/news/muesli-bt-and-studio-releases/">Read the release update</a>
</div>

## Related research

[Collective robotics under physical uncertainty](/research/#collective-robotics-under-physical-uncertainty) · [All EICRL projects](/projects/)
