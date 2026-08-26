---
title: "Installation"
description: "Install Blackwell from GitHub and choose the correct JAX platform package."
weight: 10
draft: false
---

Blackwell requires Python 3.11 or newer. It is not yet published on PyPI, so install the current revision directly from GitHub.

### pip

```console
python -m pip install "blackwell @ git+https://github.com/unswei/blackwell.git"
```

### uv

```console
uv add "blackwell @ git+https://github.com/unswei/blackwell.git"
```

Verify the installation:

```console
python -c "import blackwell; print(blackwell.__version__)"
```

The Git repository currently reports version `0.0.0`, reflecting its pre-alpha status.

## JAX platform choice

The core dependency installs the standard JAX build. CPU execution is enough for the examples and many small localisation problems. GPU and TPU packages are deliberately not pinned because the correct wheel depends on your accelerator, driver and platform.

Follow the [official JAX installation guide](https://docs.jax.dev/en/latest/installation.html) for accelerator support.

<div class="blackwell-docs-note">
<p><strong>Install JAX once.</strong> If your environment already has an accelerator-specific JAX installation, install Blackwell into the same environment. Avoid replacing it afterwards with an incompatible CPU-only wheel.</p>
</div>

## Optional plotting support

Examples run without plotting. To save their Matplotlib figures, clone the repository and install the plotting extra:

```console
git clone https://github.com/unswei/blackwell.git
cd blackwell
python -m pip install -e ".[plot]"
python examples/se2_localisation.py --plot localisation.png
```

## Development checkout

```console
git clone https://github.com/unswei/blackwell.git
cd blackwell
uv sync --all-extras
uv run pytest
```

Continue with the [five-minute localisation](/blackwell/getting-started/quickstart/), or read [Platforms and JAX](/blackwell/help/platforms/) for backend notes.
