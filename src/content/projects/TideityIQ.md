 ---

title: "TideityIQ: Complexity on Command Line"
description: "A C-based CLI that eyeballs your JS code and spits out Big O, Θ, Ω—quirky name, serious output."
date: 2025-07-19
tags: \['CLI','C','Complexity','Analysis','JavaScript']
sourceUrl: "https://github.com/medishen/TideityIQ"
---

# TideityIQ: Complexity on Command Line

Yeah, the name’s weird and I can barely say it either. I built TideityIQ because I was curious about my JavaScript functions’ time complexity. It’s written in C, compiles to a tiny `tdq` binary, and right now it only understands recursive JS patterns. It’s rough, incomplete, but it nails the basics: Big O, Θ, and Ω.

## What’s In It?

* **C‑Powered CLI**: Fast, standalone `tdq` executable
* **JS‑Only**: Analyzes `.js` files, focuses on recursive functions
* **Complexity Report**: Prints Big O, Theta, Omega with a brief explanation
* **Still WIP**: Doesn’t catch every algorithm, but handles common cases

## Quickstart

```bash
git clone https://github.com/medishen/TideityIQ.git
cd TideityIQ
make
sudo make install
```

Analyze your file:

```bash
tdq hello.js
```

Sample output:

```
Big O: O(2^n)
Theta: Θ(2^n)
Omega: Ω(1)
```

*See more examples and edge cases in the repo.*
