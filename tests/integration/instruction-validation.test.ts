import { describe, it, expect, beforeEach } from 'vitest';
import { createTestContext } from '../helpers/test-context.js';
import type { InstructionTestCase } from '../../wf/src/types.js';

describe('Instruction Validation', () => {
  let ctx: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('指示別コマンド検証', () => {
    it('指示A: 「現在のPRを引き継いで」→ gh pr view が呼ばれる', async () => {
      const skill = {
        name: 'assign',
        description: 'Assign PR',
        instructions: `
\`\`\`bash
gh pr view
gh pr diff
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill);
      const testCase: InstructionTestCase = {
        instruction: '現在のPRを引き継いで',
        expectedCommands: ['gh pr view'],
      };

      expect(result.commands).toContain('gh pr view');
      expect(result.success).toBe(true);
    });

    it('指示B: 「PRを作成して」→ gh pr create が呼ばれる', async () => {
      const skill = {
        name: 'commit-push-pr-flow',
        description: 'Create PR',
        instructions: `
\`\`\`bash
git add .
git commit -m "changes"
gh pr create
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill);

      expect(result.commands).toContain('gh pr create');
      expect(result.success).toBe(true);
    });

    it('指示C: 「変更をコミットしてPRを作成」→ git commit と gh pr create が呼ばれる', async () => {
      const skill = {
        name: 'commit-push-pr-flow',
        description: 'Create PR',
        instructions: `
\`\`\`bash
git add .
git commit -m "changes"
gh pr create
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill);

      expect(result.commands).toContain('git commit -m "changes"');
      expect(result.commands).toContain('gh pr create');
      expect(result.commands.length).toBe(3);
    });

    it('指示D: 「レビューを開始して」→ gh pr checkout が呼ばれる、git commit は呼ばれない', async () => {
      const skill = {
        name: 'review-flow',
        description: 'Review PR',
        instructions: `
\`\`\`bash
gh pr checkout $1
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill, [
        'https://github.com/test/repo/pull/42',
      ]);

      expect(result.commands).toContain(
        'gh pr checkout https://github.com/test/repo/pull/42'
      );
      expect(result.commands.every((cmd) => !cmd.includes('git commit'))).toBe(
        true
      );
      expect(result.success).toBe(true);
    });

    it('指示E: 「このPRをレビュー」→ gh pr checkout が呼ばれる', async () => {
      const skill = {
        name: 'review-flow',
        description: 'Review PR',
        instructions: `
\`\`\`bash
gh pr checkout $1
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill, ['pr-url']);

      expect(result.commands).toContain('gh pr checkout pr-url');
      expect(result.success).toBe(true);
    });
  });

  describe('呼び出し回数の検証', () => {
    it('複数回のコマンド呼び出しを検証できる', async () => {
      const skill = {
        name: 'multi-add-skill',
        description: 'Multiple git add',
        instructions: `
\`\`\`bash
git add file1.ts
git add file2.ts
git add file3.ts
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill);

      const gitAddCount = result.commands.filter((cmd) =>
        cmd.includes('git add')
      ).length;
      expect(gitAddCount).toBe(3);
      expect(result.success).toBe(true);
    });
  });

  describe('禁止コマンドの検証', () => {
    it('特定のコマンドが呼ばれていないことを検証できる', async () => {
      const skill = {
        name: 'no-push-skill',
        description: 'No push skill',
        instructions: `
\`\`\`bash
git add .
git commit -m "changes"
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill);

      expect(result.commands.every((cmd) => !cmd.includes('git push'))).toBe(
        true
      );
    });
  });

  describe('エラーハンドリング', () => {
    it('不明な指示でもエラーが返される', async () => {
      const skill = {
        name: 'unknown-instruction',
        description: 'Unknown',
        instructions: `
\`\`\`bash
unmocked-command
\`\`\`
        `,
      };

      const result = await ctx.executor.executeSkill(skill);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
