import chalk from 'chalk';
import ora from 'ora';
import type { Ora } from 'ora';

export class Logger {
  private spinner: Ora | null = null;

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  chaos(message: string): void {
    console.log(chalk.magenta('🔥'), chalk.magenta(message));
  }

  header(message: string): void {
    console.log();
    console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════════════'));
    console.log(chalk.bold.cyan(`  ${message}`));
    console.log(chalk.bold.cyan('═══════════════════════════════════════════════════════════════'));
    console.log();
  }

  section(message: string): void {
    console.log();
    console.log(chalk.bold.yellow(`▶ ${message}`));
  }

  list(items: string[]): void {
    items.forEach((item) => {
      console.log(chalk.gray('  •'), item);
    });
  }

  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  stopSpinner(message?: string, success: boolean = true): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(message);
      } else {
        this.spinner.fail(message);
      }
      this.spinner = null;
    }
  }

  printFrameworkInfo(framework: any): void {
    console.log();
    console.log(chalk.bold('Framework:'), chalk.cyan(framework.name));
    console.log(chalk.gray('  Category:'), framework.category);
    console.log(chalk.gray('  CLI Command:'), framework.cliCommand);
    console.log(chalk.gray('  Package Manager:'), framework.packageManager);
    console.log(chalk.gray('  Popularity:'), '★'.repeat(framework.popularity));
    console.log(chalk.gray('  Stability:'), '■'.repeat(framework.stability));
  }

  printSelection(selection: any): void {
    console.log();
    console.log(chalk.bold('🎲 Random Selection:'));
    console.log(chalk.gray('  Framework:'), chalk.cyan(selection.framework.name));
    if (selection.template) {
      console.log(chalk.gray('  Template:'), chalk.yellow(selection.template));
    }
    if (selection.libraries.length > 0) {
      console.log(chalk.gray('  Libraries:'));
      selection.libraries.forEach((lib: string) => {
        console.log(chalk.gray('    •'), chalk.green(lib));
      });
    }
    if (selection.features.length > 0) {
      console.log(chalk.gray('  Features:'));
      selection.features.forEach((feature: string) => {
        console.log(chalk.gray('    •'), chalk.magenta(feature));
      });
    }
  }

  printChaosWarning(): void {
    console.log();
    console.log(chalk.bold.magenta('⚠️  CHAOS MODE ENABLED ⚠️'));
    console.log(chalk.magenta('  Compatibility rules have been disabled!'));
    console.log(chalk.magenta('  Expect the unexpected! 🎲'));
    console.log();
  }
}

export const logger = new Logger();
