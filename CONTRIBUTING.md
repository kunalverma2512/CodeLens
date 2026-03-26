# Contributing to CodeLens

First off, thank you for considering contributing to CodeLens. By participating in this project, you are helping build an unapologetically honest engineering tool.

## 1. Branching Strategy
We adhere to strict branch naming conventions:
- `feat/feature-name` (for new UI modules, backend routes, algorithms)
- `fix/bug-description` (for hotfixes and CSS corrections)
- `chore/task-name` (for documentation, dependency updates, and tooling)

## 2. Code Standards

### The Frontend Rulebook
1. **Strict Brutalism:** No rounded corners (`rounded-none` implicitly or explicitly). Colors are restricted to pure `black` and `white`, plus grayscale for disabled elements.
2. **Generous Whitespace:** Utilize extremely large padding (`py-20`, `py-32`) to allow typography to breathe.
3. **Massive Typography:** Headers should scale dramatically (`text-5xl` to `text-9xl`). Use `font-black` and `uppercase tracking-widest` heavily.

### The Backend Rulebook
1. **ES Modules Only:** `require()` is strictly forbidden. Use `import` and `export` everywhere. Ensure all local imports contain the `.js` extension (e.g., `import db from './config/db.js'`).
2. **Modular Architecture:** Do not dump logic into monolithic files. Controllers parse the request, Services execute business/AI logic, and the Database layer handles queries.
3. **AI Determinism:** When modifying the Gemini API interfaces, strictly enforce prompt engineering that demands deterministic JSON structures (no markdown wrappers).

## 3. Pull Request Submission
1. Ensure your code satisfies `npm run lint` if applicable.
2. If modifying UI, test on both desktop `lg` views and mobile viewports (`flex-col` scaling).
3. Draft a thorough PR description mapping your solution to the original GitHub issue.
4. Request review from a core maintainer.

## 4. Issues & Feedback
If you locate a bug, please check the existing issue tracker before creating a duplicate. For new features, open a discussion thread outlining the architectural approach before submitting large PRs.
