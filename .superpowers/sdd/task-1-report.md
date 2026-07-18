# Task 1 Report: Lock the revised desktop structure with a failing render test

## Changes

- Added the eight exact desktop structure regression assertions from the brief to `tests/rendered-html.test.mjs`, immediately after reading `html`.
- No production code or assets were changed.

## RED command/output

Command:

```bash
npm run build && node --test tests/rendered-html.test.mjs
```

Result: RED, exit code `1`.

The build completed successfully. The focused render test failed at the first new assertion:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /\/assets\/computer2\.png/.
```

The rendered HTML still contained `/assets/game-console.png`, `REPLAY YOUR SAVES`, `把收藏，`, and `插回生活里。`; its navigation buttons also lacked the named `nav-icon` classes. This is the expected failure state for the current implementation.

## Files changed

- `tests/rendered-html.test.mjs`
- `.superpowers/sdd/task-1-report.md`

## Self-review

- Confirmed the added assertions match the brief verbatim.
- Confirmed they are placed after `const html = await response.text();`.
- Confirmed `git diff --check` passes.
- Confirmed no production files or assets were modified.
- Confirmed the specified command was run freshly and produced the intended RED failure before committing.

## Concerns

- The existing test still positively asserts `把收藏，` and `插回生活里。`; this intentionally remains unchanged because Task 1 only requests adding the failing assertions. A later implementation task will need to reconcile those legacy assertions with the revised desktop contract.
- The build emitted existing Vinext warnings about proxy environment variables, deprecated `module.register()`, and dynamic route classification; none caused the RED result.
