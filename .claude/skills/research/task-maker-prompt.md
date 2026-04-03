**Your task**: Create a learning task file for the topic "TOPIC_NAME" at `tasks/<topic-kebab-case>.md`.

Use this EXACT format — the `/test-me` skill parses this structure:

```markdown
---
topic: <Topic Display Name>
type: react | typescript | both
difficulty: beginner | intermediate | advanced
created: <YYYY-MM-DD>
---

# <Topic Display Name>

## Concepts

### Q1: <question text>
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

<answer text with explanation>

</details>

### Q2: <question text>
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

<answer text>

</details>

### Q3: <question text>
<!-- type: conceptual -->

<details>
<summary>Answer</summary>

<answer text>

</details>

## Code Challenges

### C1: <challenge title>
<!-- type: code -->
<!-- file: src/demos/<relevant-file> OR src/exercises/<relevant-file> -->

<challenge description — tell the user what to build or modify>

<details>
<summary>Hint</summary>

<hint text>

</details>

<details>
<summary>Solution</summary>

```jsx (or ```typescript)
<solution code>
```

</details>

### C2: <challenge title>
<!-- type: code -->
<!-- file: src/demos/<relevant-file> OR src/exercises/<relevant-file> -->

<challenge description>

<details>
<summary>Hint</summary>

<hint text>

</details>

<details>
<summary>Solution</summary>

```jsx (or ```typescript)
<solution code>
```

</details>
```

Requirements:
- At least 3 conceptual questions (Q1–Q3), progressing from basic recall to application
- At least 2 code challenges (C1–C2), referencing the demo/exercise file created by the other agent
- Questions should test understanding, not just memorization
- Code challenges should require the user to modify or extend the demo
- Include realistic, runnable solution code
