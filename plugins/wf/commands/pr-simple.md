---
name: creating-simple-pull-requests
description: Creates minimal pull requests without additional processing. Creates branch and PR following template with Japanese description. Use when quickly proposing changes without waiting for CI or code review.
model: haiku
disable-model-invocation: true
---

- create branch(if current branch in default) and pr
- following pr template
- description in japanese
- create create pr subtask
- 提出後は gh pr view --web で差分を共有して完了してください
