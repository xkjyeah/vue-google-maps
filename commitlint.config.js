module.exports = {
  rules: {
    // --- Type ---
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // --- Scope (required in this repo) ---
    "scope-enum": [2, "always", ["v2", "v3", "next", "docs", "root", "all"]],
    "scope-case": [2, "always", "lower-case"],
    "scope-empty": [2, "never"],

    // --- Subject ---
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-min-length": [2, "always", 15],

    // --- Header (type(scope): subject combined) ---
    "header-max-length": [2, "always", 100],
    "header-trim": [2, "always"],

    // --- Body ---
    // Downgraded to warning (1): the rule uses strict empty-string equality,
    // which fails when editors insert whitespace-only blank lines.
    "body-leading-blank": [1, "always"],
    // Per-line limit (replaces the fragile total body-max-length).
    "body-max-line-length": [2, "always", 200],

    // --- Footer ---
    // Same reasoning as body-leading-blank: warning to survive editor whitespace.
    "footer-leading-blank": [1, "always"],
    // Per-line limit (replaces footer-max-length: 300 which blocked long refs).
    "footer-max-line-length": [2, "always", 200],
  },
};
