---
title: "📚 Documentation Spelling Errors"
labels: documentation, spelling
assignees: rbcmgs
---

## Spelling Errors Detected

The automated spellcheck workflow has detected potential spelling errors in the documentation.

### Results from spellcheck run

```plaintext
{{ env.SPELLCHECK_ERRORS }}
```

### How to fix these errors

1. **If these are legitimate spelling errors**: Please correct them in the relevant files.

2. **If these are false positives (technical terms, proper names, etc.)**: Add them to the `.github/wordlist.txt` file to prevent them from being flagged in the future.

3. **Run the spellcheck locally** to verify your fixes:

   ```bash
   pip install pyspelling pymdown-extensions
   pyspelling -c .github/spellcheck.yaml
   ```

This issue will be automatically updated or closed when the errors are fixed.
