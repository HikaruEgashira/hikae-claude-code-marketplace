export interface CommandRunner {
  run(command: string): Promise<string>;
}

export class RealCommandRunner implements CommandRunner {
  async run(command: string): Promise<string> {
    const { execa } = await import('execa');
    const { stdout } = await execa('bash', ['-c', command]);
    return stdout;
  }
}

export class MockCommandRunner implements CommandRunner {
  constructor(
    private mockResponses: Map<
      string,
      string | ((cmd: string) => string)
    >
  ) {}

  async run(command: string): Promise<string> {
    for (const [pattern, response] of this.mockResponses.entries()) {
      if (command.includes(pattern)) {
        return typeof response === 'function' ? response(command) : response;
      }
    }

    throw new Error(`Unmocked command: ${command}`);
  }

  setResponse(
    pattern: string,
    response: string | ((cmd: string) => string)
  ): void {
    this.mockResponses.set(pattern, response);
  }

  getResponse(pattern: string): string | ((cmd: string) => string) | undefined {
    return this.mockResponses.get(pattern);
  }

  clearResponses(): void {
    this.mockResponses.clear();
  }
}
