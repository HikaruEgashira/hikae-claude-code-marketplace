---
name: pr
description: PR作成からCIとレビューまで
model: haiku
disable-model-invocation: true
---

commmit skill を使用して変更を意味ある単位に分割コミットした後、
parallelで以下を進めます。

- create create pr subtask
    - create branch and pr
    - following pr template
    - description in japanese
    - 提出後は gh pr checks --watch で CI 成功を確認し、必要に応じて gh pr view --web で差分を共有します。
- subagentで deslop skill を使用したコードの自動整形を行い。commit & push します。
- QA subagentで実際のユースケースにおける動作確認を実施して、品質を評価します。
- subagentで review-pr skill を使用したペアプロ形式のレビューを行い結果を報告します。

最終的に以下の項目を報告し、PR authorの身になってペアプロセッションを開始してください。
- PR URL
- 再現可能な動作確認方法とその結果
- リスクアセスメント
