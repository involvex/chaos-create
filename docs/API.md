# API Documentation

This document provides detailed API documentation for chaos-create.

## Table of Contents

- [Core API](#core-api)
- [Framework Registry API](#framework-registry-api)
- [Randomizer API](#randomizer-api)
- [Generators API](#generators-api)
- [Utilities API](#utilities-api)
- [Type Definitions](#type-definitions)

## Core API

### Main Entry Point

```typescript
import { Command } from 'commander';

const program = new Command();
```

### Commands

#### `create`

Creates a new random application.

```typescript
program
  .command('create')
  .description('Create a new random app')
  .option('-c, --category <category>', 'App category')
  .option('-f, --framework <framework>', 'Specific framework')
  .option('--chaos', 'Enable chaos mode')
  .option('--no-libs', 'Skip library injection')
  .option('--no-features', 'Skip feature generation')
  .option('--lib-count <number>', 'Number of libraries')
  .option('--no-install', 'Skip installation')
  .option('--start', 'Start dev server')
  .action(async (options) => {
    // Implementation
  });
```

**Options**:

- `category`: App category (`web`, `mobile`, `desktop`, `cli`, `backend`)
- `framework`: Specific framework ID
- `chaos`: Enable chaos mode (boolean)
- `libs`: Include libraries (boolean)
- `features`: Include features (boolean)
- `lib-count`: Number of libraries (number, default: 3)
- `install`: Install dependencies (boolean)
- `start`: Start dev server (boolean)

#### `list`

Lists all available frameworks.

```typescript
program
  .command('list')
  .description('List all available frameworks')
  .action(() => {
    // Implementation
  });
```

#### `chaos`

Enters pure chaos mode.

```typescript
program
  .command('chaos')
  .description('Enter pure chaos mode')
  .action(async () => {
    // Implementation
  });
```

## Framework Registry API

### Framework Interface

```typescript
interface Framework {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'desktop' | 'cli' | 'backend';
  cliCommand: string;
  cliArgs?: string[];
  packageManager: 'bun' | 'npm' | 'yarn' | 'pnpm' | 'flutter' | 'deno' | 'cargo' | 'go' | 'none';
  popularity: number; // 1-10
  stability: number; // 1-10
  compatibleLibraries: string[];
  builtInTemplates?: string[];
  gitTemplateSources?: string[];
  postInstallCommands?: string[];
}
```

### Functions

#### `getFrameworkById(id: string)`

Retrieves a framework by its ID.

```typescript
const framework = getFrameworkById('react-vite');
// Returns: Framework | undefined
```

**Parameters**:

- `id`: Framework identifier

**Returns**: Framework object or undefined

#### `getFrameworksByCategory(category: Framework['category'])`

Retrieves all frameworks in a specific category.

```typescript
const webFrameworks = getFrameworksByCategory('web');
// Returns: Framework[]
```

**Parameters**:

- `category`: Framework category

**Returns**: Array of frameworks

#### `getAllCategories()`

Retrieves all available categories.

```typescript
const categories = getAllCategories();
// Returns: Framework['category'][]
```

**Returns**: Array of category strings

## Randomizer API

### RandomizationOptions Interface

```typescript
interface RandomizationOptions {
  category?: Framework['category'];
  frameworkId?: string;
  chaosMode: boolean;
  includeLibraries: boolean;
  includeFeatures: boolean;
  libraryCount?: number;
}
```

### RandomSelection Interface

```typescript
interface RandomSelection {
  framework: Framework;
  libraries: string[];
  features: string[];
  template?: string;
}
```

### Randomizer Class

#### Constructor

```typescript
const randomizer = new Randomizer(chaosMode: boolean);
```

**Parameters**:

- `chaosMode`: Enable chaos mode (default: false)

#### `selectFramework(category?, frameworkId?)`

Selects a framework based on options.

```typescript
const framework = randomizer.selectFramework('web', 'react-vite');
// Returns: Framework
```

**Parameters**:

- `category`: Optional category filter
- `frameworkId`: Optional specific framework ID

**Returns**: Selected framework

**Throws**: Error if framework not found

#### `selectLibraries(framework, count)`

Selects random libraries for a framework.

```typescript
const libraries = randomizer.selectLibraries(framework, 3);
// Returns: string[]
```

**Parameters**:

- `framework`: Framework object
- `count`: Number of libraries to select (default: 3)

**Returns**: Array of library names

#### `selectFeatures(category, count)`

Selects random features for a category.

```typescript
const features = randomizer.selectFeatures('web', 2);
// Returns: string[]
```

**Parameters**:

- `category`: Framework category
- `count`: Number of features to select (default: 2)

**Returns**: Array of feature names

#### `selectTemplate(framework)`

Selects a template for a framework.

```typescript
const template = randomizer.selectTemplate(framework);
// Returns: string | undefined
```

**Parameters**:

- `framework`: Framework object

**Returns**: Template name or undefined

#### `generate(options)`

Generates a complete random selection.

```typescript
const selection = randomizer.generate({
  chaosMode: false,
  includeLibraries: true,
  includeFeatures: true,
  libraryCount: 3,
});
// Returns: RandomSelection
```

**Parameters**:

- `options`: RandomizationOptions object

**Returns**: Complete RandomSelection object

## Generators API

### FrameworkGenerator Class

#### `generate(framework, projectName, outputDir)`

Generates a new project using a framework.

```typescript
const generator = new FrameworkGenerator();
const projectPath = await generator.generate(framework, 'my-app', './output');
// Returns: Promise<string>
```

**Parameters**:

- `framework`: Framework object
- `projectName`: Name for the project
- `outputDir`: Output directory path

**Returns**: Promise resolving to project path

**Throws**: Error if generation fails

#### `installDependencies(framework, projectPath)`

Installs dependencies for a project.

```typescript
await generator.installDependencies(framework, projectPath);
// Returns: Promise<void>
```

**Parameters**:

- `framework`: Framework object
- `projectPath`: Path to the project

**Returns**: Promise

#### `startDevServer(framework, projectPath)`

Starts the development server.

```typescript
await generator.startDevServer(framework, projectPath);
// Returns: Promise<void>
```

**Parameters**:

- `framework`: Framework object
- `projectPath`: Path to the project

**Returns**: Promise

### LibraryInjector Class

#### `injectLibraries(framework, projectPath, libraries)`

Injects libraries into a project.

```typescript
const injector = new LibraryInjector();
await injector.injectLibraries(framework, projectPath, ['lib1', 'lib2']);
// Returns: Promise<void>
```

**Parameters**:

- `framework`: Framework object
- `projectPath`: Path to the project
- `libraries`: Array of library names

**Returns**: Promise

**Throws**: Error if injection fails

### FeatureGenerator Class

#### `generateFeatures(framework, projectPath, features)`

Generates feature code for a project.

```typescript
const featureGenerator = new FeatureGenerator();
await featureGenerator.generateFeatures(framework, projectPath, ['auth', 'api']);
// Returns: Promise<void>
```

**Parameters**:

- `framework`: Framework object
- `projectPath`: Path to the project
- `features`: Array of feature names

**Returns**: Promise

**Throws**: Error if generation fails

## Utilities API

### Logger Class

#### `info(message)`

Logs an info message.

```typescript
logger.info('Processing...');
```

#### `success(message)`

Logs a success message.

```typescript
logger.success('Completed successfully');
```

#### `error(message)`

Logs an error message.

```typescript
logger.error('An error occurred');
```

#### `warning(message)`

Logs a warning message.

```typescript
logger.warning('This is deprecated');
```

#### `chaos(message)`

Logs a chaos mode message.

```typescript
logger.chaos('Chaos mode enabled!');
```

#### `header(message)`

Logs a header message.

```typescript
logger.header('Project Generation');
```

#### `section(message)`

Logs a section message.

```typescript
logger.section('Installing dependencies');
```

#### `list(items)`

Logs a list of items.

```typescript
logger.list(['item1', 'item2', 'item3']);
```

#### `startSpinner(message)`

Starts a loading spinner.

```typescript
logger.startSpinner('Loading...');
```

#### `updateSpinner(message)`

Updates the spinner message.

```typescript
logger.updateSpinner('Still loading...');
```

#### `stopSpinner(message, success)`

Stops the spinner.

```typescript
logger.stopSpinner('Done!', true);
```

## Type Definitions

### UserAnswers

```typescript
interface UserAnswers {
  projectName: string;
  outputDirectory: string;
  category?: Framework['category'];
  frameworkId?: string;
  chaosMode: boolean;
  includeLibraries: boolean;
  includeFeatures: boolean;
  libraryCount: number;
  installDependencies: boolean;
  startDevServer: boolean;
}
```

### FeatureTemplates

```typescript
type FeatureTemplates = Record<string, Record<Framework['category'], string>>;
```

## Error Handling

### Common Errors

#### `FrameworkNotFoundError`

Thrown when a requested framework is not found.

```typescript
try {
  const framework = getFrameworkById('non-existent');
} catch (error) {
  if (error instanceof FrameworkNotFoundError) {
    console.error('Framework not found');
  }
}
```

#### `GenerationError`

Thrown when project generation fails.

```typescript
try {
  await generator.generate(framework, 'my-app', './output');
} catch (error) {
  if (error instanceof GenerationError) {
    console.error('Generation failed:', error.message);
  }
}
```

## Events

### Generation Events

```typescript
generator.on('start', (data) => {
  console.log('Generation started:', data);
});

generator.on('progress', (data) => {
  console.log('Progress:', data.percent);
});

generator.on('complete', (data) => {
  console.log('Generation complete:', data.projectPath);
});

generator.on('error', (error) => {
  console.error('Error:', error);
});
```

## Examples

### Basic Usage

```typescript
import { Randomizer } from './randomizer';
import { FrameworkGenerator } from './generators/framework-generator';

const randomizer = new Randomizer(false);
const selection = randomizer.generate({
  chaosMode: false,
  includeLibraries: true,
  includeFeatures: true,
  libraryCount: 3,
});

const generator = new FrameworkGenerator();
const projectPath = await generator.generate(selection.framework, 'my-app', './output');

console.log('Project created at:', projectPath);
```

### Advanced Usage

```typescript
import { Randomizer, FrameworkGenerator, LibraryInjector } from './index';

const randomizer = new Randomizer(true);
const selection = randomizer.generate({
  category: 'web',
  chaosMode: true,
  includeLibraries: true,
  includeFeatures: true,
  libraryCount: 5,
});

const generator = new FrameworkGenerator();
const projectPath = await generator.generate(selection.framework, 'my-chaos-app', './output');

const injector = new LibraryInjector();
await injector.injectLibraries(selection.framework, projectPath, selection.libraries);

console.log('Chaos app created!');
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Type Safety**: Use TypeScript interfaces for all parameters
3. **Async Operations**: Use async/await for all async operations
4. **Resource Cleanup**: Clean up resources after use
5. **Logging**: Use the Logger class for consistent output

## Support

For API-related questions:

- [GitHub Issues](https://github.com/involvex/chaos-create/issues)
- [API Documentation](https://github.com/involvex/chaos-create/blob/main/docs/API.md)
- [Examples](https://github.com/involvex/chaos-create/tree/main/examples)
