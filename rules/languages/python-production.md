# Production Python Engineering Standards

Defines strict standards for Python 3.12+ systems using typing, Pydantic, and virtual environment hygiene.

---

## 1. Type Annotations and Static Analysis

- **Complete Type Hints:** Annotate all function arguments, return types, and class fields.
- **MyPy Strict:** Run MyPy with strict type checking enabled. Disallow untyped function definitions.
- **Modern Syntax:** Use built-in generics (`list[str]`, `dict[str, int]`) and pipe union syntax (`str | None`) rather than legacy `typing` constructs.

---

## 2. Pydantic Models and Data Integrity

- **Pydantic V2 Models:** Represent boundary payloads, configuration records, and database responses using Pydantic models.
- **Immutability:** Set `model_config = ConfigDict(frozen=True)` on domain value objects.
- **Field Validation:** Use `@field_validator` to enforce domain business invariants at parse time.
