---
name: creating-pull-requests
description: Creates pull requests with full CI validation and code review. Creates branch and PR following template in Japanese, monitors CI, and performs automated code cleanup and review. Use when ready to propose changes and need comprehensive PR workflow with validation.
model: haiku
disable-model-invocation: true
---

parallelで以下を進めます。
- create create pr subtask
    - create branch and pr
    - following pr template
    - description in japanese
    提出後は gh pr checks --watch で CI 成功を確認し、必要に応じて gh pr view --web で差分を共有します。
- comment-cleaner subagent diffに含まれる不要なコメントを削除します
- code-reviewer subagent を使用してレビューを進めてその結果を出力します
