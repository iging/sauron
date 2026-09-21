---
description: Executes Red-Green-Refactor test verification gate before code changes are permitted.
---

Execute the Sauron TDD test-gate protocol:

1. Verify that a failing test was written demonstrating the missing behavior or defect.
2. Run the test suite to confirm initial red state.
3. Review production code to ensure only minimal code was written to pass.
4. Verify all tests pass with exit code 0.
5. Confirm that branch coverage meets or exceeds the required threshold.
