#!/usr/bin/env bun
import { Command } from 'commander';
import { promptUser, type UserAnswers } from './prompts';
import { Randomizer, type RandomizationOptions } from './randomizer';
import { FrameworkGenerator } from './generators/framework-generator';
import { LibraryInjector } from './generators/library-injector';
import { FeatureGenerator } from './generators/feature-generator';
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

async function createApp(options: any) {
  logger.header('🎲 CHAOS CREATE 🎲');

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
