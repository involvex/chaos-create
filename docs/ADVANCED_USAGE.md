# Advanced Usage Guide

This guide covers advanced usage patterns and configurations for chaos-create.

## Table of Contents

- [Configuration](#configuration)
- [Custom Templates](#custom-templates)
- [Framework Customization](#framework-customization)
- [Library Management](#library-management)
- [Feature Templates](#feature-templates)
- [Automation](#automation)
- [Troubleshooting](#troubleshooting)

## Configuration

### Environment Variables

chaos-create supports several environment variables for customization:

```bash
# Set default package manager
export CHAOS_PACKAGE_MANAGER=bun

# Set default output directory
export CHAOS_OUTPUT_DIR=~/projects

# Enable chaos mode by default
export CHAOS_CHAOS_MODE=true

# Set default library count
export CHAOS_LIB_COUNT=5
```

### Configuration File

Create a `.chaosrc.json` file in your project root:

```json
{
  "defaults": {
    "packageManager": "bun",
    "outputDirectory": "./projects",
    "chaosMode": false,
    "libraryCount": 3,
    "includeFeatures": true
  },
  "preferences": {
    "frameworks": ["react-vite", "nextjs", "vue-vite"],
    "categories": ["web", "mobile"],
    "excludeLibraries": ["deprecated-lib"]
  }
}
```

## Custom Templates

### Creating Custom Templates

1. **Create a templates directory**:

   ```bash
   mkdir -p ~/.chaos-templates
   ```

2. **Add your template**:

   ```bash
   ~/.chaos-templates/
   ├── my-react-template/
   │   ├── package.json
   │   ├── src/
   │   └── README.md
   ```

3. **Use your template**:
   ```bash
   chaos-create create --template ~/.chaos-templates/my-react-template
   ```

### Template Structure

A valid template should include:

```
my-template/
├── package.json          # Required
├── src/                 # Source files
├── public/              # Static assets
├── README.md            # Documentation
└── .chaos-template.json # Template metadata
```

### Template Metadata

Create a `.chaos-template.json` file:

```json
{
  "name": "My Custom Template",
  "description": "A custom React template",
  "framework": "react",
  "category": "web",
  "variables": {
    "projectName": "string",
    "useTypescript": "boolean",
    "styling": ["css", "scss", "tailwind"]
  }
}
```

## Framework Customization

### Adding Custom Frameworks

Edit the framework registry in `src/framework-registry.ts`:

```typescript
{
  id: 'my-custom-framework',
  name: 'My Custom Framework',
  category: 'web',
  cliCommand: 'my-cli',
  cliArgs: ['create', '{projectName}'],
  packageManager: 'bun',
  popularity: 8,
  stability: 9,
  compatibleLibraries: ['lib1', 'lib2'],
  builtInTemplates: ['basic', 'advanced'],
  postInstallCommands: ['bun install']
}
```

### Framework Priority

Control framework selection priority:

```typescript
// Higher values = more likely to be selected
popularity: 10,  // 1-10 scale
stability: 10,   // 1-10 scale
```

## Library Management

### Custom Library Sets

Define custom library sets in your config:

```json
{
  "librarySets": {
    "frontend-essentials": ["react-router-dom", "axios", "zustand"],
    "testing": ["vitest", "@testing-library/react", "msw"]
  }
}
```

### Library Exclusion

Exclude specific libraries:

```bash
chaos-create create --exclude-libraries deprecated-lib,old-package
```

### Library Version Pinning

Pin specific library versions:

```json
{
  "libraryVersions": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

## Feature Templates

### Creating Feature Templates

Add custom features in `src/generators/feature-generator.ts`:

```typescript
'My Custom Feature': {
  web: `
import { useState } from 'react';

export function MyCustomFeature() {
  const [state, setState] = useState(null);

  return (
    <div>
      <h1>My Custom Feature</h1>
      {/* Your feature code */}
    </div>
  );
}
`,
  mobile: `
import React from 'react';
import { View, Text } from 'react-native';

export function MyCustomFeature() {
  return (
    <View>
      <Text>My Custom Feature</Text>
    </View>
  );
}
`
}
```

### Feature Categories

Organize features by category:

```typescript
const featureCategories = {
  authentication: ['User authentication', 'OAuth', 'JWT'],
  data: ['REST API', 'GraphQL', 'WebSockets'],
  ui: ['Dark mode', 'Responsive design', 'Animations'],
};
```

## Automation

### CI/CD Integration

#### GitHub Actions

```yaml
name: Generate Random App

on:
  workflow_dispatch:
    inputs:
      category:
        description: 'App category'
        required: true
        default: 'web'
      chaos_mode:
        description: 'Enable chaos mode'
        required: false
        default: false

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install chaos-create
        run: bun install
      - name: Generate app
        run: |
          bun run src/index.ts create \
            --category ${{ github.event.inputs.category }} \
            ${{ github.event.inputs.chaos_mode && '--chaos' || '' }}
```

### Scripting

Create batch generation scripts:

```bash
#!/bin/bash
# generate-apps.sh

for i in {1..5}; do
  echo "Generating app $i..."
  bun run src/index.ts create \
    --category web \
    --chaos \
    --no-install \
    --output-dir "./generated/app-$i"
done
```

### Programmatic Usage

Use chaos-create programmatically:

```typescript
import { Randomizer } from './src/randomizer';
import { FrameworkGenerator } from './src/generators/framework-generator';

const randomizer = new Randomizer(true);
const selection = randomizer.generate({
  chaosMode: true,
  includeLibraries: true,
  includeFeatures: true,
  libraryCount: 3,
});

const generator = new FrameworkGenerator();
await generator.generate(selection.framework, 'my-app', './output');
```

## Troubleshooting

### Common Issues

#### Framework CLI Not Found

**Problem**: `command not found: framework-cli`

**Solution**:

```bash
# Install the framework CLI globally
bun install -g framework-cli

# Or use npx
npx framework-cli create my-app
```

#### Permission Denied

**Problem**: `Permission denied` when creating files

**Solution**:

```bash
# Check directory permissions
ls -la

# Fix permissions
chmod 755 /path/to/directory
```

#### Dependency Installation Fails

**Problem**: `npm install` fails

**Solution**:

```bash
# Clear cache
bun pm cache rm

# Try with different registry
bun install --registry=https://registry.npmjs.org
```

### Debug Mode

Enable debug logging:

```bash
CHAOS_DEBUG=1 bun run src/index.ts create
```

### Verbose Output

Get detailed output:

```bash
bun run src/index.ts create --verbose
```

## Performance Tips

### Speed Up Generation

1. **Use local templates**:

   ```bash
   chaos-create create --template ./local-template
   ```

2. **Skip dependency installation**:

   ```bash
   chaos-create create --no-install
   ```

3. **Use cache**:
   ```bash
   chaos-create create --cache
   ```

### Memory Management

For large-scale generation:

```bash
# Limit concurrent operations
CHAOS_MAX_CONCURRENT=2 bun run src/index.ts create
```

## Best Practices

### Project Organization

```
projects/
├── web/
│   ├── react-app-1/
│   ├── vue-app-2/
│   └── svelte-app-3/
├── mobile/
│   ├── rn-app-1/
│   └── flutter-app-2/
└── backend/
    └── api-1/
```

### Naming Conventions

Use consistent naming:

```bash
# Good
chaos-create create --project-name my-awesome-app

# Avoid
chaos-create create --project-name MyAwesomeApp
```

### Version Control

Initialize git for generated projects:

```bash
cd generated-project
git init
git add .
git commit -m "Initial commit"
```

## Advanced Examples

### Multi-Project Generation

```bash
# Generate 10 random web apps
for i in {1..10}; do
  bun run src/index.ts create \
    --category web \
    --project-name "web-app-$i" \
    --output-dir "./projects/web"
done
```

### Custom Framework Combination

```bash
# Create a React Native app with Deno backend
bun run src/index.ts create \
  --framework react-native \
  --chaos \
  --include-libraries \
  --lib-count 5
```

### Template-Based Generation

```bash
# Generate from specific template
bun run src/index.ts create \
  --template ./my-custom-template \
  --project-name my-app
```

## Additional Resources

- [Main Documentation](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Framework Registry](../src/framework-registry.ts)
- [Issue Tracker](https://github.com/involvex/chaos-create/issues)

## Support

For issues and questions:

- [GitHub Issues](https://github.com/involvex/chaos-create/issues)
- [GitHub Discussions](https://github.com/involvex/chaos-create/discussions)
- [Email Support](mailto:support@example.com)
