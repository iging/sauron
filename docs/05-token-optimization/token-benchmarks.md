# Token Optimization Benchmarks

Sauron has no published benchmark for Caveman Mode yet, so it makes no claim about how many tokens the mode saves. Results vary by model, task, and tier.

---

## Measure It Yourself

1. Pick a small set of real tasks, such as a bug diagnosis, a pull request review, and a refactor explanation.
2. Run each task with Caveman Mode off, using the same model and starting context.
3. Run each task again with the tier you want to test.
4. Compare the output tokens that your tool reports.
5. Check that code, paths, commands, and error text stayed exact in both runs.

Publish a result only with the raw data and the steps to reproduce it.

---

## Why Token Optimization Matters

1. **Context Longevity**: Filler uses context space that code and requirements could use.
2. **Cost Efficiency**: Fewer output tokens mean lower usage on metered APIs.
3. **Faster Inference**: Shorter outputs finish streaming sooner.
