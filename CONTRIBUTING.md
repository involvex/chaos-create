# Contributing to chaos-create

Thank you for your interest in contributing to chaos-create! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that the bug has already been reported. When creating a bug report, please include:

- **Description**: A clear and concise description of the bug
- **Steps to Reproduce**: Steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Screenshots**: If applicable, add screenshots
- **Environment**:
  - OS: [e.g., Windows, macOS, Linux]
  - Node.js version: `node --version`
  - Bun version: `bun --version`
  - chaos-create version: `chaos-create --version`

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Description**: A clear and concise description of the enhancement
- **Use Case**: Why this enhancement would be useful
- **Alternatives**: Any alternative solutions or features you've considered
- **Additional Context**: Any other context or screenshots about the feature request

## 🛠️ Development Setup

### Prerequisites

- **Bun**: >= 1.0.0
- **Node.js**: >= 18.0.0
- **Git**: Latest version

### Installation

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/chaos-create.git
   cd chaos-create
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Run the development server**:
   ```bash
   bun run dev
   ```

### Project Structure

```
chaos-create/
├── src/
│   ├── index.ts                    # Main CLI entry point
│   ├── prompts.ts                   # Interactive prompts
│   ├── framework-registry.ts        # Framework database
│   ├── randomizer.ts                # Randomization engine
│   ├── generators/
│   │   ├── framework-generator.ts  # Framework CLI wrappers
│   │   ├── library-injector.ts      # Library injection
│   │   └── feature-generator.ts     # Feature code generation
│   ├── utils/
│   │   └── logger.ts                # Terminal output utilities
│   └── index.test.ts                # Test file
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
└── README.md
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

### Writing Tests

Tests are written using Bun's built-in test runner. Create test files alongside your source files with the `.test.ts` extension.

Example test:

```typescript
import { describe, it, expect } from 'bun:test';
import { myFunction } from './my-module';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction()).toBe('expected');
  });
});
```

## 📝 Code Style

### Linting and Formatting

We use ESLint and Prettier to maintain code quality:

```bash
# Run linter
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check

# Type check
bun run typecheck

# Run all checks
bun run verify
```

### Code Style Guidelines

- **TypeScript**: Use TypeScript for all new code
- **Imports**: Use type-only imports where appropriate
- **Formatting**: Follow Prettier configuration
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/types
- **Comments**: Add comments for complex logic, but prefer self-documenting code

## 🚀 Building

```bash
# Build the project
bun run build

# The built files will be in the dist/ directory
```

## 📚 Adding New Frameworks

To add a new framework to the registry:

1. **Edit `src/framework-registry.ts`**:

   ```typescript
   {
     id: 'my-framework',
     name: 'My Framework',
     category: 'web', // or 'mobile', 'desktop', 'cli', 'backend'
     cliCommand: 'bun',
     cliArgs: ['create', 'my-framework', '{projectName}'],
     packageManager: 'bun',
     popularity: 8,
     stability: 9,
     compatibleLibraries: ['lib1', 'lib2', 'lib3'],
     builtInTemplates: ['basic', 'advanced'],
     postInstallCommands: ['bun install']
   }
   ```

2. **Add feature templates** in `src/generators/feature-generator.ts`:

   ```typescript
   'My Feature': {
     web: `// Your web feature code`,
     mobile: `// Your mobile feature code`,
     // ... other categories
   }
   ```

3. **Test the new framework**:
   ```bash
   bun run src/index.ts create --framework my-framework
   ```

## 🔄 Pull Request Process

1. **Update the README** if you've changed the API or added features
2. **Add tests** for any new functionality
3. **Ensure all tests pass**: `bun test`
4. **Run code quality checks**: `bun run verify`
5. **Update the CHANGELOG.md** with your changes
6. **Create a pull request** with a clear description of your changes

### Pull Request Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe how you tested your changes

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective
- [ ] New and existing tests pass locally
```

## 📖 Documentation

### Updating Documentation

- **README.md**: Update for user-facing changes
- **CHANGELOG.md**: Add entries for all changes
- **Code comments**: Update inline documentation
- **Type definitions**: Ensure TypeScript types are accurate

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- **New Frameworks**: Add support for more frameworks
- **Feature Templates**: Create more feature code templates
- **Git Integration**: Implement git template pulling
- **Configuration**: Add config file support
- **Tests**: Improve test coverage
- **Documentation**: Improve documentation and examples
- **Bug Fixes**: Help fix reported issues
- **Performance**: Optimize performance

## 💬 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: For private inquiries

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Acknowledgments

Thank you for taking the time to contribute to chaos-create! Every contribution helps make this project better for everyone.
