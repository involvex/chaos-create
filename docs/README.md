# Documentation

Welcome to the chaos-create documentation hub. This directory contains comprehensive documentation for the chaos-create CLI tool.

## 📚 Documentation Index

### Getting Started

- [README.md](../README.md) - Main project documentation and quick start guide
- [Installation](../README.md#installation) - How to install and set up chaos-create
- [Basic Usage](../README.md#usage) - Basic commands and examples

### Core Documentation

- [Advanced Usage Guide](./ADVANCED_USAGE.md) - Advanced features and configurations
- [API Documentation](./API.md) - Complete API reference and type definitions
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute to the project
- [Changelog](../CHANGELOG.md) - Version history and changes

### Guides

- [Framework Registry](../src/framework-registry.ts) - Available frameworks and their configurations
- [Feature Templates](../src/generators/feature-generator.ts) - Available feature templates
- [Configuration](./ADVANCED_USAGE.md#configuration) - Configuration options and environment variables

### Reference

- [Type Definitions](./API.md#type-definitions) - TypeScript interfaces and types
- [Error Handling](./API.md#error-handling) - Common errors and solutions
- [Best Practices](./API.md#best-practices) - Recommended patterns and approaches

## 🚀 Quick Links

### For Users

- [Installation Guide](../README.md#installation)
- [Basic Commands](../README.md#usage)
- [Examples](../README.md#examples)
- [Troubleshooting](./ADVANCED_USAGE.md#troubleshooting)

### For Developers

- [Contributing Guide](../CONTRIBUTING.md)
- [API Documentation](./API.md)
- [Development Setup](../CONTRIBUTING.md#development-setup)
- [Testing](../CONTRIBUTING.md#testing)

### For Contributors

- [Adding Frameworks](../CONTRIBUTING.md#adding-new-frameworks)
- [Creating Templates](./ADVANCED_USAGE.md#custom-templates)
- [Code Style](../CONTRIBUTING.md#code-style)
- [Pull Request Process](../CONTRIBUTING.md#pull-request-process)

## 📖 Documentation Structure

```
docs/
├── README.md              # This file - documentation index
├── ADVANCED_USAGE.md      # Advanced usage guide
└── API.md                 # API documentation
```

## 🔍 Search Documentation

### Common Topics

- **How to add a new framework?** → [Adding Frameworks](../CONTRIBUTING.md#adding-new-frameworks)
- **How to create custom templates?** → [Custom Templates](./ADVANCED_USAGE.md#custom-templates)
- **How to configure chaos-create?** → [Configuration](./ADVANCED_USAGE.md#configuration)
- **API reference?** → [API Documentation](./API.md)
- **Troubleshooting?** → [Troubleshooting](./ADVANCED_USAGE.md#troubleshooting)
- **Contributing?** → [Contributing Guide](../CONTRIBUTING.md)

## 🛠️ Development Documentation

### Project Structure

- [Source Code](../src/) - Main source code directory
- [Framework Registry](../src/framework-registry.ts) - Framework definitions
- [Generators](../src/generators/) - Code generation modules
- [Utilities](../src/utils/) - Helper utilities

### Key Modules

- [Randomizer](../src/randomizer.ts) - Random selection engine
- [Framework Generator](../src/generators/framework-generator.ts) - Project generation
- [Library Injector](../src/generators/library-injector.ts) - Library management
- [Feature Generator](../src/generators/feature-generator.ts) - Feature code generation

## 📝 Documentation Standards

### Writing Documentation

When contributing documentation:

1. **Use clear headings** - Organize content with descriptive headings
2. **Include code examples** - Show, don't just tell
3. **Add links** - Reference related documentation
4. **Keep it updated** - Ensure docs match current implementation
5. **Use consistent formatting** - Follow existing style

### Code Examples

All code examples should:

- Be complete and runnable
- Include necessary imports
- Have clear comments
- Follow project code style

### Documentation Templates

#### New Feature Documentation

````markdown
## Feature Name

Brief description of the feature.

### Usage

```bash
command example
```
````

### Options

- `option1`: Description
- `option2`: Description

### Examples

```typescript
// Code example
```

### See Also

- [Related Feature](link)
- [API Reference](link)

```

## 🤝 Contributing to Documentation

We welcome documentation improvements! See the [Contributing Guide](../CONTRIBUTING.md) for details.

### Ways to Contribute

- Fix typos and grammatical errors
- Add missing examples
- Improve clarity and organization
- Add new documentation sections
- Translate documentation

### Documentation Review Process

1. Create a pull request with your documentation changes
2. Ensure all links work correctly
3. Test code examples
4. Update table of contents if needed
5. Submit for review

## 📢 Documentation Updates

Stay informed about documentation changes:

- Watch the [repository](https://github.com/involvex/chaos-create) for updates
- Check the [CHANGELOG.md](../CHANGELOG.md) for version changes
- Follow [GitHub Discussions](https://github.com/involvex/chaos-create/discussions)

## 🔗 External Resources

- [Bun Documentation](https://bun.sh/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Commander.js](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

## 💡 Tips

### Reading Documentation

- Start with [README.md](../README.md) for an overview
- Check [ADVANCED_USAGE.md](./ADVANCED_USAGE.md) for detailed features
- Reference [API.md](./API.md) for implementation details
- Use [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidance

### Finding Information

- Use the table of contents in each document
- Search for keywords using your browser's find function
- Check the [Documentation Index](#-documentation-index) above
- Look at code comments in source files

### Getting Help

- Check [Troubleshooting](./ADVANCED_USAGE.md#troubleshooting) first
- Search [GitHub Issues](https://github.com/involvex/chaos-create/issues)
- Ask in [GitHub Discussions](https://github.com/involvex/chaos-create/discussions)
- Contact maintainers for critical issues

## 📊 Documentation Metrics

- **Total Documents**: 4
- **API Endpoints**: 15+
- **Code Examples**: 30+
- **Framework Support**: 17+
- **Feature Templates**: 20+

---

**Last Updated**: 2025-01-03
**Documentation Version**: 1.0.0
**Maintained by**: [@involvex](https://github.com/involvex)

For questions or suggestions about documentation, please [open an issue](https://github.com/involvex/chaos-create/issues).
```
