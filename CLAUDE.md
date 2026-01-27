# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal static website hosted on GitHub Pages using Jekyll with the `jekyll-shell-theme` (terminal/shell aesthetic). The site features a cat/kitten theme with a retro terminal interface.

## Build & Development Commands

```bash
# Install dependencies
bundle install

# Build the site (outputs to _site/)
bundle exec jekyll build

# Serve locally with live reload (http://localhost:4000)
bundle exec jekyll serve
```

## Deployment

Push to `main` branch triggers automatic GitHub Pages deployment. No custom CI/CD workflows.

## Architecture

- **Static site generator**: Jekyll with remote theme (`tareqdandachi/jekyll-shell-theme`)
- **Content pages**: Markdown files with YAML front matter (`index.md`, `about.md`)
- **Single layout**: `_layouts/default.html` - base HTML template with favicon and CSS references
- **Custom styling**: `assets/css/style.scss` overrides theme defaults (blue/magenta terminal colors, Courier New font)

## Key Configuration

- `_config.yml`: Jekyll settings, theme config (username: 'visitor', hostname: 'kittens'), plugin list
- `Gemfile`: Ruby dependencies (github-pages, jekyll-feed, jekyll-seo-tag, jekyll-remote-theme)
