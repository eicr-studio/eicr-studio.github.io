"""Fail when generated Hugo pages contain broken local links or anchors."""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class PageParser(HTMLParser):
    """Collect identifiers and link-like attributes from one HTML page."""

    def __init__(self) -> None:
        super().__init__()
        self.identifiers: set[str] = set()
        self.links: list[str] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        del tag
        values = dict(attrs)
        if identifier := values.get("id"):
            self.identifiers.add(identifier)
        self.links.extend(
            value
            for name in ("href", "src")
            if (value := values.get(name)) is not None
        )


def resolve_target(site: Path, source: Path, raw_link: str) -> tuple[Path, str] | None:
    """Resolve one local URL to its generated file and optional fragment."""

    url = urlsplit(raw_link)
    if url.scheme or url.netloc or raw_link.startswith(("mailto:", "javascript:", "data:")):
        return None

    path = unquote(url.path)
    if path.startswith("/"):
        target = site / path.removeprefix("/")
    else:
        target = source.parent / path if path else source
    target = target.resolve()

    if target.is_dir() or path.endswith("/"):
        target /= "index.html"
    return target, unquote(url.fragment)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site", type=Path, help="generated Hugo output directory")
    arguments = parser.parse_args()
    site = arguments.site.resolve()

    pages: dict[Path, PageParser] = {}
    for file in site.rglob("*.html"):
        page = PageParser()
        page.feed(file.read_text(encoding="utf-8"))
        pages[file] = page

    broken: list[str] = []
    for source, page in pages.items():
        for raw_link in page.links:
            resolved = resolve_target(site, source, raw_link)
            if resolved is None:
                continue
            target, fragment = resolved
            if not target.exists():
                broken.append(f"{source.relative_to(site)} -> {raw_link}")
            elif fragment and target.suffix == ".html":
                target_page = pages.get(target)
                if target_page is not None and fragment not in target_page.identifiers:
                    broken.append(
                        f"{source.relative_to(site)} -> {raw_link} (missing anchor)"
                    )

    if broken:
        print("\n".join(broken))
        raise SystemExit(f"{len(broken)} broken local links or anchors")
    print(f"Checked {len(pages)} HTML pages: no broken local links or anchors")


if __name__ == "__main__":
    main()
