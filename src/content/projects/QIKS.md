---

title: "QIKS: Fast Cache for TypeScript"
description: "An in-memory TypeScript cache—built out of boredom, packed with features, and surprisingly solid."
date: 2025-07-19
tags: ['Cache','TypeScript']
sourceUrl: "https://github.com/medishen/qiks"
---

# QIKS: Fast Cache for TypeScript

Yeah, I was bored and wanted to explore the world of caching—so I built QIKS. It’s got more features than you probably need, most of them actually work, and it runs at microsecond speed.

## What’s In It?

* **µs‑level Ops**: 1M+ ops/sec, O(1) CRUD
* **Eviction Policies**: LRU, LFU, MRU
* **Hybrid Expiration**: TTL, idle timeout, manual purge
* **Dependency Graph**: Cascade invalidation out of the box
* **Namespaces**: Logical separation without extra instances
* **TypeSafe™**: Full TS generics, no guessing

*Find the docs, changelog, and more in the repo.*
