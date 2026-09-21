# Go Concurrency and Engineering Standards

Defines guidelines for Go services covering goroutines, error propagation, and interface contracts.

---

## 1. Concurrency and Goroutine Safety

- **Context Propagation:** Always pass `context.Context` as the first argument in asynchronous functions, I/O routines, and database operations.
- **Goroutine Lifetime:** Never launch a goroutine without a deterministic cancellation signal or exit trigger. Prevent goroutine leaks using worker pools and channels.
- **Race Condition Audits:** Always run test suites with `go test -race` enabled.

---

## 2. Explicit Error Propagation

- **Check Every Error:** Never discard returned error values with the blank identifier (`_`).
- **Error Wrapping:** Wrap errors with context using `fmt.Errorf("reading config: %w", err)` to preserve unwrap capabilities.
- **Small Interfaces:** Keep interfaces small, ideally 1 to 3 methods. Define interfaces at the consumer boundary, not the provider.
