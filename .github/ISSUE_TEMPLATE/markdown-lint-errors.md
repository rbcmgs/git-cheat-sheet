---
title: "📝 Markdown Linting Errors"
labels: documentation, formatting
assignees: rbcmgs
---

## Markdown Linting Errors Detected

The automated markdown linting workflow has detected formatting issues in the documentation.

### Results from markdown lint run

```plaintext
{{ env.MARKDOWNLINT_ERRORS }}
```

### How to fix these errors

1. **Review the error messages** above to identify which files and lines contain formatting issues.

2. **Common markdown linting errors include**:
   - Incorrect header hierarchy (headers should increment by one level)
   - Inconsistent indentation in lists
   - Line length exceeding limits
   - Missing blank lines around headers and lists
   - Inconsistent bullet styles
   - Trailing spaces or improper spacing

3. **Run the markdown linter locally** to verify your fixes:

   ```bash
   npm install -g markdownlint-cli2
   markdownlint-cli2 "**/*.md"
   ```

4. **To ignore specific rules** for valid exceptions, you can add comments in your markdown:

   ```markdown
   <!-- markdownlint-disable MD013 -->
   This is a very long line that exceeds the line length limit but is allowed because we disabled the rule.
   <!-- markdownlint-enable MD013 -->
   ```

This issue will be automatically updated or closed when the errors are fixed.
