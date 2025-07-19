---

title: "NExa: Dev.to Article Fetcher"
description: "CLI tool to grab the latest dev.to posts—straight to your terminal."
date: 2025-07-19
tags: ['CLI','Python','dev.to','Docker']
sourceUrl: "https://github.com/m-mdy-m/NExa"
---

# NExa: Dev.to Article Fetcher

Sick of opening your browser for every dev.to update? NExa slides right into your terminal, grabs the top posts in a snap, and shows you titles, authors, and timestamps—no extra fluff.

## What’s In It?

* Pick a category (latest, programming, etc.)
* Fetch top articles from dev.to via CLI
* Pretty-print title, author, time, and excerpt
* Extend or tweak in Python—zero magic
* Docker image if you hate local setups

## Quickstart

### Docker (easy mode)

```bash
docker pull bitsgenix/nexa
docker run --rm -it bitsgenix/nexa
```

### Pip (DIY mode)

```bash
git clone https://github.com/m-mdy-m/NExa.git
cd NExa
python3 -m venv venv && source venv/bin/activate
pip install -e .
nexa
```

## Usage

```bash
$ nexa
Choose a category:
1) latest    2) programming    3) your-choice
Select ▶ 1
```

See your feed pop up—title, author, time, excerpt—all colored for easy scanning.

## Philosophy

Terminal first. No browser bloated tabs. Keep it tiny, keep it Pythonic, and get the news without leaving your shell.
