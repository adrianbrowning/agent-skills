---
name: node-best-practices
description: Apply or review Node.js, TypeScript, Docker, testing, production, security, performance, error-handling, and project-architecture practices using curated guidance. Use for implementing, reviewing, refactoring, debugging, or preparing a Node.js service for production.
---

# Node.js Best Practices

Use the bundled guidance to make a Node.js change or review specific, safe, and proportionate. Treat [`reference/README.md`](reference/README.md) and the files it links as the authoritative practice catalog; do not reproduce or invent a parallel checklist.

## Workflow

1. Establish the task boundary: inspect the affected code, configuration, tests, deployment files, and any repository instructions. Identify the runtime surface involved (HTTP, workers, CLI, data access, containers, CI, or npm publishing).

2. Select the relevant practice areas in [Practice map](#practice-map), then locate their entries in [`reference/README.md`](reference/README.md). Read the entry's TL;DR and “Otherwise” consequence before deciding on a change or finding.

3. Follow that entry's local **Read More** link when the recommendation affects an implementation decision, its trade-offs are unclear, or an example is needed. Those linked files under [`reference/sections/`](reference/sections/) are the detailed reference. Prefer their local examples and assets over remembered advice.

4. Apply the guidance to the actual codebase. Preserve its established framework, package manager, and conventions unless the task calls for changing them. Treat library names in the catalog as examples: verify compatibility with the project's Node version and dependencies before adding one.

5. Validate in proportion to the change: run the project's relevant checks, exercise changed error paths and boundaries, and inspect generated/container configuration when applicable.

6. Finish only when every practice area relevant to the affected runtime surface has been considered, every material recommendation is either implemented or explicitly explained as inapplicable, and the result is supported by code or test evidence.

## Practice map

Use the smallest applicable set of README sections. The listed sections are routing labels, not an automatic requirement to apply every practice.

| When the task involves | Start in README section |
| --- | --- |
| component boundaries, layers, configuration, framework, or TypeScript scope | **1. Project Architecture Practices** |
| thrown errors, rejected promises, logging, validation, process failure, or API error responses | **2. Error Handling Practices** |
| JavaScript/TypeScript conventions, modules, async code, linting, or side effects | **3. Code Style Practices** |
| unit/API/e2e tests, fixtures, coverage, mocks, ports, or static analysis | **4. Testing And Overall Quality Practices** |
| observability, dependencies, process uptime, deployment, scaling, memory, or production environment | **5. Going To Production Practices** |
| secrets, authentication, input handling, injection, dependency risk, redirects, child processes, or npm publishing | **6. Security Practices** |
| event-loop latency or avoidable utility/library overhead | **7. Performance Practices** |
| images, Dockerfiles, build secrets, container lifecycle, runtime limits, or image scanning | **8. Docker Practices** |

## Review output

When reviewing rather than changing code, report only findings that are actionable in the current codebase. For each finding, give the affected location, the failure mode, the applicable README practice, and a concrete remediation. Rank security, data-loss, outage, and correctness risks above maintainability suggestions. State which relevant areas were checked when that context would make the review auditable.

## Reference boundaries

- [`reference/README.md`](reference/README.md) is the index and concise rationale for the complete catalog.
- [`reference/sections/`](reference/sections/) contains the linked deep dives, examples, and supporting assets. Load an individual document through its README link instead of scanning the entire directory.
- [`reference/assets/`](reference/assets/) supplies README illustrations and examples; it is reference material, not an independent policy source.
- The translated READMEs were omitted to keep this package focused. Use the English README for canonical paths.
- [`ATTRIBUTION.md`](ATTRIBUTION.md) and [`reference/LICENSE`](reference/LICENSE) state the source and reuse terms.
