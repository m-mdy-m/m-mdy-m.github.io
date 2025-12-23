---
title: "PSX"
description: "A command-line tool that validates and automatically fixes project structures across different programming languages."
date: 2025-01-19
tags: ['CLI', 'Go', 'Project Management', 'Automation', 'Standards', 'Tooling']
sourceUrl: "https://github.com/m-mdy-m/psx"
---

# PSX: Project Structure Checker

A command-line tool that validates project structures against configurable rules and automatically creates missing files and folders. PSX ensures projects follow conventions consistently, whether you're starting new work or maintaining existing codebases.

## The Core Problem

Projects accumulate technical debt in structure as much as code. A missing README here, no license file there, forgotten documentation, inconsistent directory layouts. These issues compound over time and create friction for contributors.

Manual checking doesn't scale. You can't remember every file that should exist. Different people follow different conventions. Standards drift across repositories. Automation solves this by enforcing rules consistently everywhere.

## How PSX Works

The tool scans your project directory and compares it against forty-seven built-in rules. Each rule checks for specific files, folders, or configurations. Missing items are reported with clear severity levels: errors for critical issues, warnings for recommended additions, info for optional improvements.

Auto-fix mode goes beyond detection. PSX can create missing files from templates, generate proper directory structures, and set up standard configurations. Templates adapt based on your project type, so Node.js projects get appropriate defaults while Go projects get different ones.

Configuration happens through simple YAML files. Enable or disable rules individually. Set severity levels per rule. Define custom files and folders specific to your needs. Ignore patterns exclude paths that shouldn't be checked.

## Rule Categories

General rules apply to every project regardless of language. README files explain what the project does. License files specify usage terms. CHANGELOG documents version history. GITIGNORE prevents committing unnecessary files.

Structure rules ensure proper organization. Source code belongs in dedicated directories. Tests have their own location. Documentation lives separately from code. Scripts are isolated from source files.

Documentation rules verify proper project docs exist. Contributing guidelines help new people participate. Security policies explain vulnerability reporting. Code of conduct sets community standards. Issue and pull request templates standardize submissions.

CI and CD rules check automation setup. GitHub Actions workflows for testing and building. Renovate configuration for dependency updates. Dependabot settings for security patches. Proper release automation.

Quality rules validate development tool configuration. EditorConfig maintains formatting consistency. Pre-commit hooks enforce standards before commits. Linter configurations catch common mistakes. Code formatters keep style uniform.

DevOps rules ensure deployment readiness. Dockerfiles for containerization. Docker Compose for multi-container setups. Kubernetes manifests for orchestration. Infrastructure as code templates.

## Project Detection

PSX examines your files to determine project type automatically. Looking for package.json identifies Node.js projects. Finding go.mod indicates Go. Detection happens without configuration and influences which rules apply.

Language-specific rules activate based on detection. Node.js projects get package manager checks. Go projects have module validation. Generic projects receive universal rules that apply everywhere.

Manual override is available when needed. Specify project type explicitly in configuration. This handles edge cases or unusual structures the detector misses.

## Auto-Fix Features

File creation uses embedded templates. Each file type has default content that gets customized automatically. README templates differ by language. License templates fill in your information. All templates generate appropriate defaults.

Directory creation happens with proper naming conventions. Source folders follow language standards. Test directories include initial structure. Documentation folders get basic organization.

Interactive mode asks before making changes. See what will be created and approve each one individually. Dry-run mode previews changes without applying them. This lets you understand effects before committing.

## Configuration System

The YAML config lives in your project root. Define which rules run and at what severity. Enable all rules with errors, some with warnings, others disabled. The configuration adapts the tool to your needs.

Custom rules extend the built-in set. Define required files not in standard rules. Specify folders your team needs. Set up validation for project-specific requirements.

Ignore patterns exclude paths from checking. Node_modules doesn't need validation. Build output folders are skipped. Generated code is ignored. The configuration makes exceptions explicit.

## Installation Options

Single binary releases require no dependencies. Download for your platform and run immediately. Linux, macOS, and Windows are supported with both amd64 and arm64 architectures.

Docker images provide containerized execution. Run PSX without local installation. The image includes everything needed. Mount your project directory and check it.

Installation scripts automate setup. One command downloads, verifies, installs, and configures PSX. Platform detection handles differences automatically.

Building from source gives the latest code. The Go codebase compiles quickly. Standard tooling means familiar commands. Modify and rebuild easily.

## CI Integration

PSX works naturally in continuous integration. Add one workflow step to check every pull request. Contributors can't merge without proper structure. Standards enforcement becomes automatic.

Exit codes make automation straightforward. Zero indicates success. One means validation failed. Higher codes signal configuration or system errors. This integrates with any CI system.

JSON output mode generates machine-readable results. Parse data in your own tools. Build custom reports. Create dashboards from checking results.

## Templates and Generation

File templates are embedded in the binary. No external resources needed. No network calls required. Everything works offline with consistent results.

Language-specific customization happens automatically. Node.js READMEs differ from Go ones. Package manager configurations adapt to the ecosystem. Generated content matches project type.

License templates include multiple options. MIT for permissive use. Apache for patent protection. GPL for copyleft requirements. BSD for minimal restrictions. Each template fills in appropriate details.

## Performance

Checking happens quickly. Small projects take milliseconds. Large codebases finish in under a second. Parallel rule execution maintains speed.

Memory usage stays low. PSX examines structure and metadata without loading entire files. Even huge projects don't cause memory issues.

Binary size remains reasonable. Compressed releases are under twenty megabytes. Embedded resources keep the tool self-contained without bloating.

## Error Handling

Failures are graceful. Problems don't crash the tool. Errors report clearly with context about what happened and why.

Validation errors provide actionable information. Output tells exactly what's wrong and how to fix it. No guessing at solutions needed.

Partial failures don't stop checking. If one rule fails, others continue running. You get complete issue visibility, not just the first problem.

## Common Use Cases

Open source projects benefit significantly. Maintain consistent structure across all repositories. New projects start complete. Existing ones can be brought up to standard.

Team standards enforcement becomes automatic. Define requirements once in configuration. Every project gets checked against them. No manual review of basic structure needed.

CI validation catches problems early. Before code review happens, structure is verified. This saves reviewer time for actual code instead of missing documentation.

Project templates get validated automatically. When creating templates for your team, PSX ensures completeness. New projects from those templates start correctly.

## Real World Usage

The tool emerged from repeatedly checking project structure manually. Looking through repositories to verify all recommended files existed. Maintaining mental checklists of what should be included. Forgetting things anyway.

PSX eliminated that overhead. Run the tool and it reports what's missing. Fix mode adds files automatically. Commit and continue working. No more checklist anxiety.

Team adoption was straightforward. One config file shared across projects. CI integration provides enforcement without nagging. Automated checking beats human reminders.

## Configuration Examples

A minimal config enables core rules only. README, license, and gitignore as errors. Everything else disabled. Suitable for small personal projects.

A comprehensive config activates everything. All rules enabled with appropriate severity. Custom files defined for team needs. Ignore patterns for generated content.

A language-specific config focuses on one ecosystem. Node.js projects get all JavaScript-related rules. Unnecessary rules for other languages disabled.

## Why Go

Go provides significant advantages for this tool. Single binary distribution makes deployment trivial. Fast compilation and execution keep things responsive. Excellent standard library reduces dependencies.

Cross-compilation to all platforms happens easily. Build for Linux, macOS, and Windows from one machine. No separate build environments needed.

Static binaries mean no runtime dependencies. Download and run immediately. No interpreter to install. No shared libraries to manage. It just works.

## Extending PSX

The architecture supports extension naturally. New rules are added by implementing one interface. The registry pattern keeps things organized. Adding functionality doesn't require restructuring.

Custom rules work through configuration. Define required files. Specify needed folders. Set up validation for specific needs.

JSON output enables external tooling. Parse results and build on them. Generate reports. Track metrics over time. Integrate with other systems.

## Project Status

PSX is actively developed and used in production. The v2 release brought major improvements. Simplified rule system. Better configuration handling. Cleaner codebase.

The tool is stable with semantic versioning. Breaking changes are avoided. Updates maintain backward compatibility. Dependence in CI doesn't cause surprises.

Future plans include more language support. Python and Rust are next targets. Additional DevOps tool configurations. Enhanced custom rule capabilities.

## Getting Started

Installation takes seconds. Download the binary or run the install script. Execute psx check in any project. See what's missing immediately.

Add a config file to customize behavior. Enable relevant rules. Disable inapplicable ones. Set severity levels appropriately.

Integrate with CI by adding one workflow step. Check projects automatically on every push. Fail builds that don't meet standards. Maintain consistency across all repositories.

## The Philosophy

Structure matters as much as code. Well-organized projects are easier to navigate. Standards help contributors. Automation removes the burden of remembering everything.

PSX doesn't enforce one true way. It provides rules representing common practice. You configure what matters to your team. The tool adapts to your needs.

The goal is consistency without thinking. Define standards once. Check them automatically. Spend time building instead of organizing.

This is the tool I needed for project structure. It might be what you need too.