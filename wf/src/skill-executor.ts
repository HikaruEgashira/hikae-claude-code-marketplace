import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import type {
  SkillDefinition,
  SkillExecutionResult,
} from './types.js';
import type { CommandRunner } from './command-runner.js';

export class SkillExecutor {
  constructor(private commandRunner: CommandRunner) {}

  async loadSkill(skillPath: string): Promise<SkillDefinition> {
    const content = await readFile(skillPath, 'utf-8');
    const { data, content: instructions } = matter(content);

    return {
      name: data.name,
      description: data.description,
      model: data.model || undefined,
      argumentHint: data['argument-hint'],
      instructions,
    };
  }

  async executeSkill(
    skill: SkillDefinition,
    args?: string[]
  ): Promise<SkillExecutionResult> {
    try {
      const commands = this.extractCommands(skill.instructions, args);
      const results: string[] = [];

      for (const cmd of commands) {
        const result = await this.commandRunner.run(cmd);
        results.push(result);
      }

      return {
        skill: skill.name,
        commands,
        outputs: results,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        skill: skill.name,
        commands: [],
        outputs: [],
        success: false,
        error: errorMessage,
      };
    }
  }

  private extractCommands(instructions: string, args?: string[]): string[] {
    // Match code blocks: ``` followed by language (optional), newline, content, then ```
    const codeBlockRegex = /```[\s\S]*?\n([\s\S]*?)```/g;
    const commands: string[] = [];
    let match;

    while ((match = codeBlockRegex.exec(instructions)) !== null) {
      const block = match[1].trim();
      const cleanedCommands = block
        .split('\n')
        .filter((line) => !line.trim().startsWith('#') && line.trim().length > 0)
        .map((line) => {
          let cmd = line;
          if (args) {
            args.forEach((arg, i) => {
              cmd = cmd.replace(new RegExp(`\\$${i + 1}`, 'g'), arg);
            });
          }
          return cmd;
        });

      commands.push(...cleanedCommands);
    }

    return commands;
  }
}
