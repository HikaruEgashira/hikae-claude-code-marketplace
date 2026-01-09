export const mockGitHubCLI = (): Map<string, string | ((cmd: string) => string)> => {
  const responses = new Map<string, string | ((cmd: string) => string)>();

  // gh pr view
  responses.set('gh pr view', `
title:  Add skill chain integration tests
state:  OPEN
author: HikaruEgashira
number: 42
url:    https://github.com/HikaruEgashira/hikae-claude-code-marketplace/pull/42
  `);

  // gh pr diff
  responses.set('gh pr diff', `
diff --git a/tests/integration/skill-chain.test.ts b/tests/integration/skill-chain.test.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/tests/integration/skill-chain.test.ts
@@ -0,0 +1,10 @@
+import { describe, it, expect } from 'vitest';
+
+describe('Skill Chain', () => {
+  it('should execute assign -> commit-push-pr-flow -> review-flow', () => {
+    expect(true).toBe(true);
+  });
+});
  `);

  // gh pr create
  responses.set('gh pr create', (cmd: string) => {
    return `https://github.com/HikaruEgashira/hikae-claude-code-marketplace/pull/100`;
  });

  // gh pr checkout
  responses.set('gh pr checkout', 'Already on branch "feature-branch"');

  return responses;
};
