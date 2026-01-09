import { describe, it, expect } from 'vitest';
import { ClaudeCLIWrapper } from '../../wf/src/claude-cli-wrapper.js';

describe('Skill Selection Evaluation', () => {
  const claude = new ClaudeCLIWrapper();

  describe('曖昧な指示 → assignスキルが実行される', () => {
    it('指示「Next」→ assignスキルが実行される', async () => {
      const result = await claude.run({
        instruction: 'Next',
        captureSkillInvocations: true,
      });

      // assignスキルが実行されることを期待
      expect(result.invokedSkills).toContain('wf:assign');
    }, 60000);

    it('指示「続けて」→ assignスキルが実行される', async () => {
      const result = await claude.run({
        instruction: '続けて',
        captureSkillInvocations: true,
      });

      expect(result.invokedSkills).toContain('wf:assign');
    }, 60000);

    it('指示「何をすればいい？」→ assignスキルが実行される', async () => {
      const result = await claude.run({
        instruction: '何をすればいい？',
        captureSkillInvocations: true,
      });

      expect(result.invokedSkills).toContain('wf:assign');
    }, 60000);

    it('指示「help」→ assignスキルが実行される', async () => {
      const result = await claude.run({
        instruction: 'help',
        captureSkillInvocations: true,
      });

      // コンテキストが不足しているため、assignスキルが実行される
      expect(result.invokedSkills).toContain('wf:assign');
    }, 60000);
  });

  describe('明確な指示 → 適切なスキルが実行される（assignは実行されない）', () => {
    it('指示「PRを作成して」→ commit-push-pr-flowが実行される', async () => {
      const result = await claude.run({
        instruction: 'PRを作成して',
        captureSkillInvocations: true,
      });

      expect(result.invokedSkills).toContain('wf:commit-push-pr-flow');
      expect(result.invokedSkills).not.toContain('wf:assign');
    }, 60000);

    it('指示「このPRをレビューして」→ review-flowが実行される', async () => {
      const result = await claude.run({
        instruction: 'このPRをレビューして',
        captureSkillInvocations: true,
      });

      expect(result.invokedSkills).toContain('wf:review-flow');
      expect(result.invokedSkills).not.toContain('wf:assign');
    }, 60000);

    it('指示「変更をコミットしてプッシュ」→ commit-push-pr-flowが実行される', async () => {
      const result = await claude.run({
        instruction: '変更をコミットしてプッシュ',
        captureSkillInvocations: true,
      });

      expect(result.invokedSkills).toContain('wf:commit-push-pr-flow');
      expect(result.invokedSkills).not.toContain('wf:assign');
    }, 60000);
  });

  describe('スキル選択の一貫性検証', () => {
    it('同じ曖昧な指示を複数回実行しても、一貫してassignが選択される', async () => {
      const results = await claude.runBatch(
        ['Next', 'Next', 'Next'],
        { captureSkillInvocations: true }
      );

      results.forEach((result) => {
        expect(result.invokedSkills).toContain('wf:assign');
      });
    }, 180000);

    it('明確な指示は一貫して正しいスキルを選択する', async () => {
      const results = await claude.runBatch(
        ['PRを作成', 'PRを作成', 'PRを作成'],
        { captureSkillInvocations: true }
      );

      results.forEach((result) => {
        expect(result.invokedSkills).toContain('wf:commit-push-pr-flow');
        expect(result.invokedSkills).not.toContain('wf:assign');
      });
    }, 180000);
  });

  describe('スキルのdescriptionベース検証', () => {
    it('assignスキル: "When context is missing" → コンテキスト不足時に実行', async () => {
      const ambiguousInstructions = [
        'Next',
        '続けて',
        '何すればいい',
        'help',
      ];

      for (const instruction of ambiguousInstructions) {
        const result = await claude.run({
          instruction,
          captureSkillInvocations: true,
        });

        expect(result.invokedSkills).toContain('wf:assign');
      }
    }, 240000);

    it('commit-push-pr-flow: "After task completion" → タスク完了後に実行', async () => {
      const taskCompletionInstructions = [
        'PRを作成',
        'コミットしてプッシュ',
        '変更をプッシュして',
      ];

      for (const instruction of taskCompletionInstructions) {
        const result = await claude.run({
          instruction,
          captureSkillInvocations: true,
        });

        expect(result.invokedSkills).toContain('wf:commit-push-pr-flow');
      }
    }, 180000);

    it('review-flow: "After PR creation" → PR作成後に実行', async () => {
      const reviewInstructions = [
        'このPRをレビュー',
        'コードレビューして',
        'レビューを開始',
      ];

      for (const instruction of reviewInstructions) {
        const result = await claude.run({
          instruction,
          captureSkillInvocations: true,
        });

        expect(result.invokedSkills).toContain('wf:review-flow');
      }
    }, 180000);
  });
});
