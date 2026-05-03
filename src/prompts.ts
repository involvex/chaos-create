import inquirer from 'inquirer';
import type { Framework } from './framework-registry';
import { getAllCategories } from './framework-registry';

export interface UserAnswers {
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

export async function promptUser(): Promise<UserAnswers> {
  const answers = await inquirer.prompt<UserAnswers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'What would you like to name your project?',
      default: 'my-chaos-app',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name can only contain lowercase letters, numbers, and hyphens';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'outputDirectory',
      message: 'Where should the project be created?',
      default: './',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Output directory cannot be empty';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'category',
      message: 'What type of app would you like to create?',
      choices: [
        { name: '🎲 Random (Let chaos decide!)', value: undefined },
        ...getAllCategories().map((cat) => ({
          name: getCategoryEmoji(cat) + ' ' + capitalizeFirst(cat),
          value: cat,
        })),
      ],
    },
    {
      type: 'confirm',
      name: 'chaosMode',
      message: '🔥 Enable CHAOS MODE? (Wild combinations, ignore compatibility rules)',
      default: false,
    },
    {
      type: 'confirm',
      name: 'includeLibraries',
      message: '📦 Add random libraries to spice things up?',
      default: true,
    },
    {
      type: 'number',
      name: 'libraryCount',
      message: 'How many random libraries would you like?',
      default: 3,
      when: (answers: UserAnswers) => answers.includeLibraries,
      validate: (input: number) => {
        if (input < 0 || input > 10) {
          return 'Please enter a number between 0 and 10';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'includeFeatures',
      message: '✨ Generate random feature ideas with working examples?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: '📥 Install dependencies now? (uses bun)',
      default: true,
    },
    {
      type: 'confirm',
      name: 'startDevServer',
      message: '🚀 Start the development server after installation?',
      default: false,
      when: (answers: UserAnswers) => answers.installDependencies,
    },
  ] as any);

  return answers;
}

export async function promptFrameworkSelection(frameworks: Framework[]): Promise<string> {
  const { frameworkId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'frameworkId',
      message: 'Which framework would you like to use?',
      choices: frameworks.map((f) => ({
        name: `${getCategoryEmoji(f.category)} ${f.name} (Popularity: ${f.popularity}/10)`,
        value: f.id,
      })),
    },
  ]);

  return frameworkId;
}

export async function promptConfirmation(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: true,
    },
  ]);

  return confirmed;
}

function getCategoryEmoji(category: Framework['category']): string {
  const emojis: Record<Framework['category'], string> = {
    web: '🌐',
    mobile: '📱',
    desktop: '💻',
    cli: '⌨️',
    backend: '⚙️',
  };
  return emojis[category] || '📦';
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
