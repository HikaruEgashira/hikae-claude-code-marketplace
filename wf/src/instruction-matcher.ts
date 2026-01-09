import type {
  InstructionTestCase,
  ValidationResult,
} from './types.js';
import type { SkillExecutor } from './skill-executor.js';

export class InstructionMatcher {
  async validateInstruction(
    testCase: InstructionTestCase,
    executor: SkillExecutor
  ): Promise<ValidationResult> {
    const skillName = this.inferSkillFromInstruction(testCase.instruction);
    const skill = await executor.loadSkill(
      `wf/skills/${skillName}/SKILL.md`
    );

    const result = await executor.executeSkill(
      { ...skill, model: testCase.model || skill.model },
      []
    );

    const validation: ValidationResult = {
      passed: true,
      errors: [],
    };

    // 期待されるコマンドがすべて呼ばれているか
    for (const expectedCmd of testCase.expectedCommands) {
      const found = result.commands.some((cmd) => cmd.includes(expectedCmd));
      if (!found) {
        validation.passed = false;
        validation.errors.push(
          `Expected command "${expectedCmd}" was not called`
        );
      }
    }

    // 禁止されたコマンドが呼ばれていないか
    if (testCase.forbiddenCommands) {
      for (const forbiddenCmd of testCase.forbiddenCommands) {
        const found = result.commands.some((cmd) =>
          cmd.includes(forbiddenCmd)
        );
        if (found) {
          validation.passed = false;
          validation.errors.push(
            `Forbidden command "${forbiddenCmd}" was called`
          );
        }
      }
    }

    // 呼び出し回数の検証
    if (testCase.callCounts) {
      for (const [cmd, expectedCount] of testCase.callCounts) {
        const actualCount = result.commands.filter((c) =>
          c.includes(cmd)
        ).length;

        if (actualCount !== expectedCount) {
          validation.passed = false;
          validation.errors.push(
            `Command "${cmd}" called ${actualCount} times, expected ${expectedCount}`
          );
        }
      }
    }

    return validation;
  }

  private inferSkillFromInstruction(instruction: string): string {
    const lowerInstruction = instruction.toLowerCase();

    // assign: PR引き継ぎ関連
    if (
      (lowerInstruction.includes('pr') && lowerInstruction.includes('引き継')) ||
      lowerInstruction.includes('assign')
    ) {
      return 'assign';
    }

    // review-flow: レビュー関連（commit-push-pr-flowより先にチェック）
    if (
      lowerInstruction.includes('review') ||
      lowerInstruction.includes('レビュー') ||
      lowerInstruction.includes('コードレビュー')
    ) {
      return 'review-flow';
    }

    // commit-push-pr-flow: コミット・PR作成関連
    if (
      lowerInstruction.includes('commit') ||
      lowerInstruction.includes('コミット') ||
      lowerInstruction.includes('pr作成') ||
      lowerInstruction.includes('pr') && lowerInstruction.includes('作成') ||
      lowerInstruction.includes('push') ||
      lowerInstruction.includes('分割')
    ) {
      return 'commit-push-pr-flow';
    }

    throw new Error(`Cannot infer skill from instruction: ${instruction}`);
  }
}
