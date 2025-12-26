---
name: discussing-coderabbit-comments
description: Engages with CodeRabbit bot comments on pull requests. Retrieves all @coderabbitai comments, validates reproducibility through testing, and creates fix subtasks when appropriate. Use when reviewing CodeRabbit feedback and addressing its suggestions.
model: sonnet
disable-model-invocation: true
---

現在のPR Commentのうち @coderabbitai によるコメントのうちresolveではないものを全て取得します。
それぞれのコメントに対してparallelで以下を進めます。
1. その指摘の再現可能性を動作確認を通して確認する
2. 修正が妥当な場合、Prompt for AI Agents の内容を元に 新たなsubtaskを作成して修正する
