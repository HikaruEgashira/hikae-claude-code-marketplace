# Integration Tests

Comprehensive integration tests for skill chains using **vitest**.

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

### Skill Chain Integration Tests

**File:** `tests/integration/skill-chain.test.ts`

- Verify individual skills execute correctly
- Test full chain: assign → commit-push-pr-flow → review-flow
- Error handling and edge cases
- Argument substitution

### Instruction Validation Tests

**File:** `tests/integration/instruction-validation.test.ts`

- Validate instructions map to correct skills
- Verify expected commands are called
- Verify forbidden commands are not called
- Validate command call counts

Example:
- 指示A: 「現在のPRを引き継いで」→ `gh pr view` が1回呼ばれる
- 指示B: 「PRを作成して」→ `gh pr view` は呼ばれない

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
