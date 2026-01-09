# Integration Tests

Comprehensive integration tests for skill chains using **vitest** and **Claude CLI**.

## Setup

```bash
npm install
```

## Run Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm test:ui

# Coverage report
npm run test:coverage

# Type check
npm run type-check
```

## Test Models

Tests run across three Claude models:
- **sonnet** (default, balanced)
- **haiku** (fast, lightweight)
- **opus** (most capable)

Run tests for specific model:

```bash
npm test -- --grep "\\[haiku\\]"
npm test -- --grep "\\[opus\\]"
```

## Test Types

### Skill Selection Evaluation Tests ⭐ **NEW**

**File:** `tests/integration/skill-selection.test.ts`

**目的**: Claude CLIが指示に対して正しいスキルを選択するかを検証

**アプローチ**:
- 実際にClaude CLIプロセスを起動
- 指示を渡してスキル実行をトレース
- スキルのdescription（実行タイミング）が正しく評価されているかを検証

**テストケース**:

**曖昧な指示 → assignスキルが実行される**
- 「Next」 → `wf:assign` が実行される（コンテキスト不足）
- 「続けて」 → `wf:assign` が実行される
- 「何をすればいい？」 → `wf:assign` が実行される

**明確な指示 → 適切なスキルが実行される（assignは実行されない）**
- 「PRを作成して」 → `wf:commit-push-pr-flow` が実行される
- 「このPRをレビュー」 → `wf:review-flow` が実行される
- 「変更をコミットしてプッシュ」 → `wf:commit-push-pr-flow` が実行される

**スキルdescriptionベース検証**:
- `assign`: "When context is missing" → コンテキスト不足時に実行
- `commit-push-pr-flow`: "After task completion" → タスク完了後に実行
- `review-flow`: "After PR creation" → PR作成後に実行

### Skill Chain Integration Tests

**File:** `tests/integration/skill-chain.test.ts`

- Verify individual skills execute correctly
- Test full chain: assign → commit-push-pr-flow → review-flow
- Error handling and edge cases
- Argument substitution

### Model Matrix Tests

**File:** `tests/integration/model-matrix.test.ts`

- Test each skill across all models
- Verify model-specific configurations
- CI/CD parallel execution (Node 20.x, 22.x × Models: sonnet, haiku, opus)

## Project Structure

```
tests/
├── integration/
│   ├── skill-chain.test.ts          # Skill chain tests
│   ├── instruction-validation.test.ts # Instruction-based tests
│   └── model-matrix.test.ts         # Model matrix tests
├── mocks/
│   ├── github-api.mock.ts           # GitHub CLI mocks
│   ├── git-commands.mock.ts         # git command mocks
│   └── fixtures.ts                  # Test fixtures
├── helpers/
│   └── test-context.ts              # Test context setup
└── README.md                        # This file
```

## Key Features

✅ **Instruction-Based Validation**
- Validate that specific instructions trigger correct skills
- Verify expected commands are called
- Track command call counts

✅ **Model Matrix Parallel Execution**
- Test across Sonnet, Haiku, and Opus models
- Node.js 20.x and 22.x compatibility
- CI/CD automation with GitHub Actions

✅ **Complete Mocking**
- GitHub API (gh commands) fully mocked
- git commands fully mocked
- No external dependencies required

✅ **Comprehensive Coverage**
- Normal flow testing
- Error handling
- Edge cases
