import { spawn } from 'child_process';

export interface ClaudeCLIResult {
  instruction: string;
  invokedSkills: string[];
  executedCommands: string[];
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ClaudeCLIOptions {
  instruction: string;
  timeout?: number;
  captureSkillInvocations?: boolean;
  captureCommands?: boolean;
}

export class ClaudeCLIWrapper {
  /**
   * Claude CLIを実行して結果をトレースする
   */
  async run(options: ClaudeCLIOptions): Promise<ClaudeCLIResult> {
    const {
      instruction,
      timeout = 30000,
      captureSkillInvocations = true,
      captureCommands = true,
    } = options;

    return new Promise((resolve, reject) => {
      const invokedSkills: string[] = [];
      const executedCommands: string[] = [];
      let stdout = '';
      let stderr = '';

      // Claude CLIプロセスを起動
      const claude = spawn('claude', ['--non-interactive'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          CLAUDE_TRACE_SKILLS: captureSkillInvocations ? '1' : '0',
          CLAUDE_TRACE_COMMANDS: captureCommands ? '1' : '0',
        },
      });

      // 標準出力をキャプチャしてスキル実行をトレース
      claude.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        stdout += output;

        // スキル実行をトレース
        // 例: "Launching skill: wf:assign"
        const skillMatch = output.match(/Launching skill: ([^\s]+)/g);
        if (skillMatch && captureSkillInvocations) {
          skillMatch.forEach((match) => {
            const skill = match.replace('Launching skill: ', '').trim();
            invokedSkills.push(skill);
          });
        }

        // コマンド実行をトレース
        // 例: "Executing command: gh pr view"
        const cmdMatch = output.match(/Executing command: ([^\n]+)/g);
        if (cmdMatch && captureCommands) {
          cmdMatch.forEach((match) => {
            const cmd = match.replace('Executing command: ', '').trim();
            executedCommands.push(cmd);
          });
        }
      });

      claude.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      // 指示を標準入力に送信
      claude.stdin.write(instruction + '\n');
      claude.stdin.end();

      // タイムアウト処理
      const timeoutId = setTimeout(() => {
        claude.kill();
        reject(new Error(`Claude CLI timeout after ${timeout}ms`));
      }, timeout);

      claude.on('close', (code) => {
        clearTimeout(timeoutId);
        resolve({
          instruction,
          invokedSkills,
          executedCommands,
          stdout,
          stderr,
          exitCode: code || 0,
        });
      });

      claude.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  /**
   * 複数の指示を連続実行
   */
  async runBatch(
    instructions: string[],
    options?: Omit<ClaudeCLIOptions, 'instruction'>
  ): Promise<ClaudeCLIResult[]> {
    const results: ClaudeCLIResult[] = [];

    for (const instruction of instructions) {
      const result = await this.run({ ...options, instruction });
      results.push(result);
    }

    return results;
  }
}
