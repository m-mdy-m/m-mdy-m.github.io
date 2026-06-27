---
title: "A Function-Theoretic Definition of Data"
abstract: "The term data is among the most frequently used and least precisely defined concepts in computing. Standard references converge on an informal characterization of data as \"raw facts,\" but none specify the formal structure that makes a collection of facts addressable, comparable, or processable by a machine. This representational ambiguity propagates into system design as schema drift, serialization defects, and a class of type-confusion vulnerabilities that arise when a fixed byte sequence is silently reinterpreted under an unstated indexing or typing assumption. This paper makes the case for treating data formally as a function from an index set to a value set, sharpens this definition with explicit well-definedness conditions, and positions it against three existing frameworks: Floridi's General Definition of Information, Zins' faceted classification, and the DIKW hierarchy. We derive four corollaries connecting this definition directly to recurring failure modes in software engineering — implicit schema coupling, byte-level reinterpretation, unsound equality checks, and ambiguous serialization contracts — with worked examples for each."
keywords: ['data representation', 'formal definition', 'information theory', 'type safety', 'serialization', 'systems design', 'data semantics']
style: "personal"
status: "published"
repository: "https://github.com/papyrxis/papers/tree/main/papers/01-function-theoretic-definition-of-data"
date: "2026"
---

A deceptively simple question: when we say "data," what *is* the thing we're pointing at? Every reference converges on "raw facts" and stops there — which is fine for a dictionary, useless for a type system.

This paper treats data as what it functionally is: a **function from an index set to a value set**, $D : I \to V$, made precise with explicit totality, functionality, and codomain-consistency conditions. That single move — taking the informal description seriously enough to formalize it — turns out to explain, directly and mechanically, four recurring classes of real systems bugs: implicit schema coupling, byte-level reinterpretation, unsound equality checks, and ambiguous serialization contracts. Each gets a worked example tracing the bug back to exactly which condition it violates.

The definition is checked against three established frameworks — Floridi's General Definition of Information, Zins' faceted classification, and the DIKW hierarchy — and shown to be compatible with, and quietly presupposed by, all three.

Full source, sections, and references are in the repository linked above; a typeset PDF will follow under Releases once the volume is built.
