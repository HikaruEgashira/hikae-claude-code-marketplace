export const mockGitCommands = (): Map<string, string | ((cmd: string) => string)> => {
  const responses = new Map<string, string | ((cmd: string) => string)>();

  responses.set('git status', `
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   tests/integration/skill-chain.test.ts
  `);

  responses.set('git branch', (cmd: string) => {
    if (cmd.includes('-M')) {
      return '';
    }
    return '* main\n  feature-branch';
  });

  responses.set('git diff HEAD', `
diff --git a/wf/src/skill-executor.ts b/wf/src/skill-executor.ts
new file mode 100644
index 0000000..abcd123
--- /dev/null
+++ b/wf/src/skill-executor.ts
@@ -0,0 +1,50 @@
+export class SkillExecutor {
+  // Implementation
+}
  `);

  responses.set('git add', '');
  responses.set('git commit', '[main abc1234] Add skill executor\n 1 file changed, 50 insertions(+)');
  responses.set('git push', 'Branch pushed successfully');

  return responses;
};
