---
name: codex-as-tools
description: |
  codex CLI をツール実行エンジンとして使い、codex 側にのみ接続済みの能力
  (Apps Connectors, MCP servers, computer use, web search) を `codex exec` 経由で
  外部エージェント (Claude Code / opencode 等) から利用する。
  Trigger: codex as tool, Google Drive アクセス, Apps Connector 利用, codex exec, ツール借用
---

## 手順

1. 前提: `codex login` 済み。Apps Connectors は ChatGPT 側で接続済みなら自動利用可。
   MCP servers は `codex mcp add <name> -- <command>` で codex 側に登録。
2. 非対話実行:

```bash
codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox \
  "Google Drive から <query> を検索し、ファイル名とURLを報告してください"
```

3. 最終メッセージは stdout 末尾に現れる。`2>/dev/null | tail -n 20` で抽出する。

## サンドボックス

- Apps Connectors / web search のみなら `-s read-only` で動く
- MCP server を使う場合は read-only だと npx/uvx のキャッシュ書き込みがブロックされ
  `MCP startup failed: handshaking` で落ちる。bypass フラグを使うか事前にキャッシュを暖める

## 逆方向 (codex をツール化)

他エージェントへ提供する場合は `codex mcp-server` (stdio, tools: codex / codex-reply) を使う。

## 制約

- Connector 認証は codex の ChatGPT アカウントに紐づく
- 1 exec あたり数十秒〜。軽量な問い合わせには向かない
- セッションは毎回新規。引き継ぎは `codex exec resume --last`
