---
title: "ARLIZ"
subtitle: "Arrays, Reasoning, Logic, Identity, Zero"
description: "One question — what is an array, really? — followed from a voltage difference across a transistor to tensor cores and quantum state vectors. Three volumes, one continuous descent."
status: "in-progress"
repository: "https://github.com/papyrxis/Arliz"
tags: ['Data Structures', 'Computer Architecture', 'Digital Logic', 'First Principles']
---

# ARLIZ: Arrays, Reasoning, Logic, Identity, Zero

> *"If I truly want to understand, I must start from zero."*

## The question that didn't stay simple

It started as an embarrassingly basic question: **what is an array, really?**

Not "how do I use `arr[i]`" — I already knew that. I wanted to know what's actually happening underneath the bracket notation. And that question refused to stay contained. It pulled a thread that ran backward through memory layout, through cache lines, through the instruction set, through logic gates, all the way down to a voltage difference across a transistor — and then forward again, up through SIMD lanes, GPU warps, and tensor cores, to the matrix operations that look nothing like an array until you squint.

By the time I admitted the question was serious, it had stopped being a book about arrays and become a book about *how information becomes computation at all*, with arrays as the thread that ties every layer together.

## Three volumes, one descent and one ascent

ARLIZ doesn't read like a typical "data structures" book because it isn't trying to teach you `int[]` syntax — you already have that. It's structured as **one continuous work in three volumes**, each a complete stage of the same journey:

| Volume | Title | Status | What it covers |
|---|---|---|---|
| **I** | *Zero to Bit* | Living draft — 78 chapters, 17 stages | Starts one level *below* a transistor: charge, voltage, current, semiconductor physics, CMOS switching — why a transistor can hold a bit at all. Then treats binary as pure mathematics (Boolean algebra) before climbing through number systems, integers, floats, characters, endianness, bitwise ops, alignment, pointers, error correction, and serialization. |
| **II** | *Silicon Horizon* | In progress — 129 chapters, 12 stages | Picks up exactly where Volume I's Boolean algebra ends. Logic gate implementation, arithmetic/sequential circuits, the full memory hierarchy, ISAs, pipelining, out-of-order execution, virtual memory, SIMD/GPU execution, and the power/thermal/security tradeoffs that come with all of it. |
| **III** | *Array Odyssey* | In progress — 184 chapters, 7 stages | Arrays themselves, finally, in full: memory layout and theory, every major variant (dynamic, sparse, multidimensional, bit arrays, ring buffers), search and sort, vectorized operations, the classic structures built on top (stacks, queues, heaps, hash tables), parallel/distributed array processing, and a tour of where arrays actually do work — ML, linear algebra, signal processing. |

The split isn't arbitrary. Volume I stops the instant a transistor can reliably hold one bit and bits compose into Boolean logic — it deliberately doesn't explain *why code runs the way it does*, only *how information gets encoded at all*. Volume II picks up there and builds upward into real hardware, without re-deriving semiconductor physics. Volume III assumes both, because you can't really talk about cache-friendly array layout until you understand what a cache *is*.

You can read any one volume standalone. But the dependency only runs one direction — which is itself the whole point of the book: most "fundamentals" content skips the layer beneath it and calls the skip an abstraction. ARLIZ tries not to skip.

## Why this exists

Most material teaches arrays as a given — a primitive you're handed, not something that had to be invented, justified, and physically realized. That always bothered me. Every data structure is downstream of a hardware reality someone had to engineer around. I wanted the chain of "why" to actually connect, link by link, instead of bottoming out in "because that's how computers work."

So ARLIZ is written for people who get uncomfortable with that answer too — who feel like they've memorized a syntax instead of understood a machine, and want to trace the thread all the way down before building back up.

## Reading it

- [Browse the LaTeX source](https://github.com/papyrxis/Arliz/tree/main/volumes) — chapter by chapter, organized by volume
- Compiled PDFs ship under [Releases](https://github.com/papyrxis/Arliz/releases), one per volume, named `<YEAR>_ARLIZ_<Volume Title>_Volume_<N>.pdf`
- [`docs/VOLUMES.md`](https://github.com/papyrxis/Arliz/blob/main/docs/VOLUMES.md) breaks down exactly what belongs where, if you want the full map before diving in

## Contributing

It's a living document, and it improves through friction — corrections, sharper examples, better diagrams, entire missing chapters. See [`docs/CONTRIBUTING.md`](https://github.com/papyrxis/Arliz/blob/main/docs/CONTRIBUTING.md) for the editorial and LaTeX standards, and [`docs/ARCHITECTURE.md`](https://github.com/papyrxis/Arliz/blob/main/docs/ARCHITECTURE.md) for how the build system and workspace presets fit together.

## License

Book content (chapters, prose, diagrams) is **CC BY-SA 4.0**. The LaTeX tooling and build scripts are **MIT**.

---

*Repository: [github.com/papyrxis/Arliz](https://github.com/papyrxis/Arliz)*
