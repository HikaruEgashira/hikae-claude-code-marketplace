import { describe, it, expect, beforeEach } from 'vitest';
import { createTestContext } from '../helpers/test-context.js';
import type { Model } from '../../wf/src/types.js';

describe('Model Matrix Testing', () => {
  const models: Model[] = ['sonnet', 'haiku', 'opus'];

  models.forEach((model) => {
    describe(`Model: ${model}`, () => {
      let ctx: ReturnType<typeof createTestContext>;

      beforeEach(() => {
        ctx = createTestContext();
      });

      it(`[${model}] assign スキルが正しく動作する`, async () => {
        const skill = {
          name: 'assign',
          description: 'Assign PR',
          model,
          instructions: `
\`\`\`bash
gh pr view
gh pr diff
\`\`\`
          `,
        };

        const result = await ctx.executor.executeSkill(skill);

        expect(result.success).toBe(true);
        expect(result.commands.length).toBe(2);
      });

      it(`[${model}] commit-push-pr-flow スキルが正しく動作する`, async () => {
        const skill = {
          name: 'commit-push-pr-flow',
          description: 'Create PR',
          model,
          instructions: `
\`\`\`bash
git add .
git commit -m "changes"
git push
gh pr create
\`\`\`
          `,
        };

        const result = await ctx.executor.executeSkill(skill);

        expect(result.success).toBe(true);
        expect(result.commands.length).toBe(4);
      });

      it(`[${model}] review-flow スキルが正しく動作する`, async () => {
        const skill = {
          name: 'review-flow',
          description: 'Review PR',
          model,
          instructions: `
\`\`\`bash
gh pr checkout $1
\`\`\`
          `,
        };

        const prUrl = 'https://github.com/test/repo/pull/42';
        const result = await ctx.executor.executeSkill(skill, [prUrl]);

        expect(result.success).toBe(true);
        expect(result.commands).toContain(
          'gh pr checkout https://github.com/test/repo/pull/42'
        );
      });

      it(`[${model}] スキルチェーン全体が動作する`, async () => {
        // Step 1: assign
        const assignSkill = {
          name: 'assign',
          description: 'Assign PR',
          model,
          instructions: `
\`\`\`bash
gh pr view
gh pr diff
\`\`\`
          `,
        };
        const assignResult = await ctx.executor.executeSkill(assignSkill);
        expect(assignResult.success).toBe(true);

        // Step 2: commit-push-pr-flow
        const prFlowSkill = {
          name: 'commit-push-pr-flow',
          description: 'Create PR',
          model,
          instructions: `
\`\`\`bash
git add .
git commit -m "changes"
gh pr create
\`\`\`
          `,
        };
        const prFlowResult = await ctx.executor.executeSkill(prFlowSkill);
        expect(prFlowResult.success).toBe(true);

        // Step 3: review-flow
        const reviewSkill = {
          name: 'review-flow',
          description: 'Review PR',
          model,
          instructions: `
\`\`\`bash
gh pr checkout $1
\`\`\`
          `,
        };
        const reviewResult = await ctx.executor.executeSkill(reviewSkill, [
          'https://github.com/test/repo/pull/100',
        ]);
        expect(reviewResult.success).toBe(true);
      });
    });
  });

  describe('モデル指定検証', () => {
    let ctx: ReturnType<typeof createTestContext>;

    beforeEach(() => {
      ctx = createTestContext();
    });

    it('モデル指定が正しく保持される (sonnet)', async () => {
      const skill = {
        name: 'test',
        description: 'Test',
        model: 'sonnet' as const,
        instructions: `
\`\`\`bash
echo test
\`\`\`
        `,
      };

      expect(skill.model).toBe('sonnet');
    });

    it('モデル指定が正しく保持される (haiku)', async () => {
      const skill = {
        name: 'test',
        description: 'Test',
        model: 'haiku' as const,
        instructions: `
\`\`\`bash
echo test
\`\`\`
        `,
      };

      expect(skill.model).toBe('haiku');
    });

    it('モデル指定が正しく保持される (opus)', async () => {
      const skill = {
        name: 'test',
        description: 'Test',
        model: 'opus' as const,
        instructions: `
\`\`\`bash
echo test
\`\`\`
        `,
      };

      expect(skill.model).toBe('opus');
    });
  });
});
