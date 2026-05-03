#!/usr/bin/env bun
import { Command } from 'commander';
import { promptUser, type UserAnswers } from './prompts';
import { Randomizer, type RandomizationOptions } from './randomizer';
import { FrameworkGenerator } from './generators/framework-generator';
import { LibraryInjector } from './generators/library-injector';
import { FeatureGenerator } from './generators/feature-generator';
import { GitTemplateManager } from './generators/git-template-manager';
import { logger } from './utils/logger';

const program = new Command();

program
  .name('chaos-create')
  .description('🎲 Create random apps with chaos and creativity!')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new random app')
  .option('-c, --category <category>', 'App category (web, mobile, desktop, cli, backend)')
  .option('-f, --framework <framework>', 'Specific framework to use')
  .option('-t, --template <url>', 'Git template URL to use instead of random framework')
  .option('--chaos', 'Enable chaos mode (wild combinations)')
  .option('--no-libs', 'Skip random library injection')
  .option('--no-features', 'Skip random feature generation')
  .option('--lib-count <number>', 'Number of random libraries', '3')
  .option('--no-install', 'Skip dependency installation')
  .option('--start', 'Start dev server after installation')
  .action(async (options) => {
    try {
      await createApp(options);
    } catch (error: any) {
      logger.error(error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all available frameworks')
  .action(() => {
    const { FRAMEWORKS, getAllCategories } = require('./framework-registry');

    logger.header('Available Frameworks');

    const categories = getAllCategories();
    categories.forEach((category: string) => {
      logger.section(capitalizeFirst(category));
      const frameworks = FRAMEWORKS.filter((f: any) => f.category === category);
      frameworks.forEach((framework: any) => {
        console.log(`  ${framework.name.padEnd(30)} (Popularity: ${framework.popularity}/10)`);
      });
    });
  });

program
  .command('chaos')
  .description('🔥 Enter pure chaos mode (maximum randomness)')
  .action(async () => {
    try {
      await createApp({
        chaos: true,
        libs: true,
        features: true,
        libCount: '5',
        install: true,
        start: false,
      });
    } catch (error: any) {
      logger.error(error.message);
      process.exit(1);
    }
  });

program
  .command('template')
  .description('📦 Manage git templates')
  .option('-u, --url <url>', 'Git repository URL')
  .option('-b, --branch <branch>', 'Git branch (default: main)')
  .option('-s, --subdirectory <path>', 'Subdirectory in the repository')
  .option('-l, --list', 'List available templates from repository')
  .option('-v, --validate', 'Validate template')
  .option('-c, --clear-cache', 'Clear template cache')
  .option('-p, --popular', 'List popular templates')
  .action(async (options) => {
    try {
      await handleTemplateCommand(options);
    } catch (error: any) {
      logger.error(error.message);
      process.exit(1);
    }
  });

async function handleTemplateCommand(options: any) {
  const templateManager = new GitTemplateManager();

  if (options.clearCache) {
    await templateManager.clearCache();
    return;
  }

  if (options.popular) {
    logger.header('Popular Templates');
    const templates = await templateManager.getPopularTemplates();
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.url}`);
    });
    return;
  }

  if (!options.url) {
    logger.error('Please provide a template URL with --url');
    process.exit(1);
  }

  const template = templateManager.parseGitUrl(options.url);
  if (options.branch) {
    template.branch = options.branch;
  }
  if (options.subdirectory) {
    template.subdirectory = options.subdirectory;
  }

  if (options.list) {
    logger.header('Available Templates');
    const templates = await templateManager.listTemplatesFromRepo(template.url);
    if (templates.length === 0) {
      logger.info('No templates found in repository');
    } else {
      templates.forEach((t) => {
        console.log(`  • ${t}`);
      });
    }
    return;
  }

  if (options.validate) {
    logger.info('Validating template...');
    const isValid = await templateManager.validateTemplate(template);
    if (isValid) {
      logger.success('Template is valid!');
    } else {
      logger.error('Template is invalid or missing package.json');
      process.exit(1);
    }
    return;
  }

  // If no specific action, prompt to create project from template
  const { projectName } = await require('./prompts').promptUser();
  const { outputDirectory } = await require('./prompts').promptUser();

  logger.info('Creating project from git template...');
  await templateManager.pullTemplate(template, projectName, outputDirectory);
  logger.success('Project created successfully!');
}

async function createFromTemplate(options: any) {
  logger.header('📦 Creating from Git Template');

  const templateManager = new GitTemplateManager();
  const template = templateManager.parseGitUrl(options.template);

  // Prompt for project details
  const { projectName } = await require('./prompts').promptUser();
  const { outputDirectory } = await require('./prompts').promptUser();

  logger.info('Creating project from git template...');
  const projectPath = await templateManager.pullTemplate(template, projectName, outputDirectory);

  // Ask about dependency installation
  const { installDependencies } = await require('./prompts').promptUser();
  if (installDependencies) {
    logger.section('Installing dependencies...');
    const frameworkGenerator = new FrameworkGenerator();
    // Try to detect package manager and install
    try {
      await frameworkGenerator.installDependencies(
        {
          packageManager: 'bun',
          postInstallCommands: ['bun install'],
        } as any,
        projectPath
      );
    } catch {
      logger.warning('Auto-install failed, please run: bun install');
    }
  }

  logger.header('🎉 Project Created Successfully! 🎉');
  logger.info(`Project location: ${projectPath}`);
  logger.info(`Template: ${options.template}`);

  if (!installDependencies) {
    logger.section('Next Steps:');
    logger.info(`  cd ${projectName}`);
    logger.info(`  bun install`);
    logger.info(`  bun run dev`);
  }
}

async function createApp(options: any) {
  logger.header('🎲 CHAOS CREATE 🎲');

  // Check if using git template
  if (options.template) {
    await createFromTemplate(options);
    return;
  }

  // Prompt user for input
  const answers: UserAnswers = await promptUser();

  // Override with command line options if provided
  const finalOptions: RandomizationOptions = {
    category: options.category || answers.category,
    frameworkId: options.framework || undefined,
    chaosMode: options.chaos || answers.chaosMode,
    includeLibraries: options.libs !== false && answers.includeLibraries,
    includeFeatures: options.features !== false && answers.includeFeatures,
    libraryCount: parseInt(options.libCount || answers.libraryCount.toString()),
  };

  // Show chaos warning if enabled
  if (finalOptions.chaosMode) {
    logger.printChaosWarning();
  }

  // Initialize randomizer
  const randomizer = new Randomizer(finalOptions.chaosMode);

  // Generate random selection
  logger.section('Generating random selection...');
  const selection = randomizer.generate(finalOptions);

  // Display selection
  logger.printSelection(selection);

  // Confirm with user
  const confirmed = await require('./prompts').promptConfirmation(
    'Does this look good? Create the project?'
  );

  if (!confirmed) {
    logger.warning('Aborted by user');
    process.exit(0);
  }

  // Create the project
  logger.section('Creating project...');

  const frameworkGenerator = new FrameworkGenerator();
  const libraryInjector = new LibraryInjector();
  const featureGenerator = new FeatureGenerator();

  // Generate framework
  const projectPath = await frameworkGenerator.generate(
    selection.framework,
    answers.projectName,
    answers.outputDirectory
  );

  // Inject libraries
  if (selection.libraries.length > 0) {
    logger.section('Injecting random libraries...');
    await libraryInjector.injectLibraries(selection.framework, projectPath, selection.libraries);
  }

  // Generate features
  if (selection.features.length > 0) {
    logger.section('Generating random features...');
    await featureGenerator.generateFeatures(selection.framework, projectPath, selection.features);
  }

  // Install dependencies
  const shouldInstall = options.install !== false && answers.installDependencies;
  if (shouldInstall) {
    logger.section('Installing dependencies...');
    await frameworkGenerator.installDependencies(selection.framework, projectPath);
  }

  // Start dev server
  const shouldStart = options.start || answers.startDevServer;
  if (shouldStart && shouldInstall) {
    logger.section('Starting development server...');
    await frameworkGenerator.startDevServer(selection.framework, projectPath);
  }

  // Success message
  logger.header('🎉 Project Created Successfully! 🎉');
  logger.info(`Project location: ${projectPath}`);
  logger.info(`Framework: ${selection.framework.name}`);
  logger.info(`Libraries added: ${selection.libraries.length}`);
  logger.info(`Features generated: ${selection.features.length}`);

  if (!shouldStart) {
    logger.section('Next Steps:');
    logger.info(`  cd ${answers.projectName}`);
    if (!shouldInstall) {
      logger.info(`  bun install`);
    }
    logger.info(`  bun run dev`);
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Parse command line arguments
program.parse();
