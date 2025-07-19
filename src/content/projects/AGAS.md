---

title: "AGAS"
description: "A minimal, CLI-friendly HTTP client powered by Bun—fast, event-driven, and type-safe."
date: 2025-07-19
tags: ['CLI','HTTP','Bun','TypeScript','Tooling']
sourceUrl: "https://github.com/m-mdy-m/agas"
---

# AGAS: The Bun-Powered HTTP Sidekick

Lightweight, blazing-fast, and built for developers who live in the terminal. AGAS gives you a no-nonsense HTTP client that feels at home in both your shell and your TypeScript apps.

## The Story

Why wrestle with bulky Node HTTP libraries when you can tap into Bun’s speed? AGAS was born from the desire for a lean, event-driven tool that spins up in milliseconds, puts you in control of every request/response cycle, and plays nicely with modern workflows—inside and outside your code.

## What Makes It Different

* **Powered by Bun**: Instant startup, ultra-fast I/O
* **CLI-First Interface**: Vivid colors, spinners, and a frictionless command set
* **Event-Driven Core**: Subscribe to request/response events for logging, retries, or custom middleware
* **Modern HTTP Goodies**: JSON parsing, FormData support, streaming bodies, timeouts, and more—out of the box
* **Type-Safe by Design**: Full TypeScript definitions ensure you never guess at a response shape
* **Docker-Ready**: Official container image means zero local dependencies

## Quickstart

Install globally and fire off a request in seconds:

```bash
npm install -g @medishn/agas
agas get https://api.example.com/data
```

Embed in your TypeScript project:

```ts
import { Agas } from '@medishn/agas';

const client = new Agas();
const response = await client.post('/login', { json: { user, pass } });
console.log(await response.json());
```

## Philosophy

Keep it simple, keep it fast, and let events do the heavy lifting. AGAS isn’t about bells and whistles—it’s about giving you just what you need to move data, no fluff attached.
