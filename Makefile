.PHONY: build check brain gate hook hooks-install lint clean

# Default: alles in volgorde
all: build check brain

# Build site
build:
	./ds build

# Component check (catalogus structuur)
check:
	./ds check

# Brain gate (wikilinks, orphans, freshness)
brain:
	./ds brain gate

# Lint (ruff)
lint:
	ruff check ds

# Installeer git hooks voor deze clone
hook hooks-install:
	bash scripts/git-hooks-install.sh

# Clean gegenereerde bestanden
clean:
	rm -rf web/*
	rm -rf components/*/index.html
