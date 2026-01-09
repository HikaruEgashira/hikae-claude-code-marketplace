import { MockCommandRunner } from '../../wf/src/command-runner.js';
import { SkillExecutor } from '../../wf/src/skill-executor.js';
import { mockGitHubCLI } from '../mocks/github-api.mock.js';
import { mockGitCommands } from '../mocks/git-commands.mock.js';
import type { TestContext } from '../../wf/src/types.js';

export const createTestContext = (): TestContext & {
  commandRunner: MockCommandRunner;
} => {
  const mockResponses = new Map([
    ...mockGitHubCLI(),
    ...mockGitCommands(),
  ]);

  const commandRunner = new MockCommandRunner(mockResponses);
  const executor = new SkillExecutor(commandRunner);

  return {
    executor,
    commandRunner,
    resetMocks: () => {
      mockResponses.clear();
      for (const [k, v] of mockGitHubCLI()) mockResponses.set(k, v);
      for (const [k, v] of mockGitCommands()) mockResponses.set(k, v);
    },
  };
};
