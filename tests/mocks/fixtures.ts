export const prFixture = {
  number: 42,
  title: 'Add skill chain integration tests',
  body: 'This PR adds integration tests for the skill chain workflow.',
  state: 'OPEN',
  author: 'HikaruEgashira',
  url: 'https://github.com/HikaruEgashira/hikae-claude-code-marketplace/pull/42',
};

export const diffFixture = `
diff --git a/tests/integration/skill-chain.test.ts b/tests/integration/skill-chain.test.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/tests/integration/skill-chain.test.ts
@@ -0,0 +1,50 @@
+import { describe, it, expect } from 'vitest';
+// ... test code
`;

export const coderabbitComments = [
  {
    id: 1,
    path: 'wf/src/skill-executor.ts',
    line: 25,
    body: 'Consider adding error handling for file read operations',
    resolved: false,
  },
  {
    id: 2,
    path: 'wf/src/command-runner.ts',
    line: 10,
    body: 'This command execution could benefit from timeout handling',
    resolved: false,
  },
];
