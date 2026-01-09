export type Model = 'sonnet' | 'haiku' | 'opus';

export interface SkillDefinition {
  name: string;
  description: string;
  model?: Model;
  argumentHint?: string;
  instructions: string;
}

export interface SkillExecutionResult {
  skill: string;
  commands: string[];
  outputs: string[];
  success: boolean;
  error?: string;
}

export interface InstructionTestCase {
  instruction: string;
  expectedCommands: string[];
  forbiddenCommands?: string[];
  callCounts?: Map<string, number>;
  model?: Model;
}

export interface ValidationResult {
  passed: boolean;
  errors: string[];
}

export interface TestContext {
  executor: SkillExecutor;
  commandRunner: CommandRunner;
  resetMocks: () => void;
}

export interface CommandRunner {
  run(command: string): Promise<string>;
}

export interface SkillExecutor {
  loadSkill(skillPath: string): Promise<SkillDefinition>;
  executeSkill(skill: SkillDefinition, args?: string[]): Promise<SkillExecutionResult>;
}
