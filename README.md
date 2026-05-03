# 🎲 chaos-create

Create random apps with chaos and creativity! A CLI tool that generates random application scaffolds using various frameworks, libraries, and features.

## Features

- 🎲 **Smart Randomization**: Intelligently selects frameworks based on category, popularity, and stability
- 🔥 **Chaos Mode**: Wild combinations that ignore compatibility rules
- 📦 **Library Injection**: Automatically adds random libraries to spice up your project
- ✨ **Feature Generation**: Generates random feature ideas with working examples
- 🌐 **Multi-Framework Support**: Web, mobile, desktop, CLI, and backend frameworks
- 💬 **Interactive Prompts**: User-friendly CLI interface
- 🚀 **Quick Start**: Automatic dependency installation and dev server startup

## Supported Frameworks

### Web
- React (Vite)
- Next.js
- Vue (Vite)
- Nuxt
- Svelte
- SolidJS
- Angular

### Mobile
- React Native
- Expo
- Expo Stack
- Flutter

### Desktop
- Tauri
- Electron

### CLI/Terminal
- Ink (React CLI)
- TUI Framework
- Deno CLI

### Backend
- Deno
- Bun Backend
- Node.js Express

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chaos-create.git
cd chaos-create

# Install dependencies
bun install

# Make it executable (optional)
chmod +x src/index.ts
```

## Usage

### Create a Random App

```bash
bun run src/index.ts create
```

This will prompt you for:
- Project name
- Output directory
- App category (or random)
- Chaos mode toggle
- Library injection options
- Feature generation options
- Dependency installation
- Dev server startup

### Command Line Options

```bash
bun run src/index.ts create [options]

Options:
  -c, --category <category>    App category (web, mobile, desktop, cli, backend)
  -f, --framework <framework>  Specific framework to use
  --chaos                      Enable chaos mode (wild combinations)
  --no-libs                    Skip random library injection
  --no-features                Skip random feature generation
  --lib-count <number>         Number of random libraries (default: 3)
  --no-install                 Skip dependency installation
  --start                      Start dev server after installation
```

### Examples

```bash
# Create a random web app
bun run src/index.ts create --category web

# Create a React Native app with chaos mode
bun run src/index.ts create --framework react-native --chaos

# Create a backend app without libraries
bun run src/index.ts create --category backend --no-libs

# Pure chaos mode
bun run src/index.ts chaos
```

### List Available Frameworks

```bash
bun run src/index.ts list
```

## How It Works

1. **Framework Selection**: Uses weighted randomization based on popularity and stability
2. **Smart Categorization**: Respects category boundaries (unless in chaos mode)
3. **Library Injection**: Adds compatible libraries based on the selected framework
4. **Feature Generation**: Creates working example code for random features
5. **Project Creation**: Executes the appropriate CLI command for the framework
6. **Dependency Management**: Uses bun as the default package manager

## Chaos Mode

Chaos mode disables compatibility rules and creates truly wild combinations:

```bash
bun run src/index.ts create --chaos
```

In chaos mode, you might get:
- React Native with Deno backend libraries
- Flutter with React state management
- CLI apps with mobile-specific features
- Any combination imaginable!

## Project Structure

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
│   └── utils/
│       └── logger.ts                # Terminal output utilities
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Areas for improvement:

- Add more frameworks to the registry
- Improve the feature code templates
- Add git template integration
- Create more chaos mode combinations
- Add tests
- Improve error handling

## License

MIT

## Author

Created with 🎲 and chaos

---

**Warning**: This tool is designed for learning and exploration. Generated projects may contain unconventional combinations that are not suitable for production use.