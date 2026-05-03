import { exec } from 'child_process';
import { promisify } from 'util';
import type { Framework } from '../framework-registry';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export class LibraryInjector {
  async injectLibraries(
    framework: Framework,
    projectPath: string,
    libraries: string[]
  ): Promise<void> {
    if (libraries.length === 0) {
      logger.info('No libraries to inject');
      return;
    }

    logger.info(`Injecting ${libraries.length} random libraries...`);

    const installCommand = this.getInstallCommand(framework, libraries);

    try {
      logger.info(`Running: ${installCommand}`);
      const { stdout, stderr } = await execAsync(installCommand, {
        cwd: projectPath,
        env: { ...process.env, FORCE_COLOR: '1' },
      });

      if (stdout) {
        logger.info(stdout);
      }

      if (stderr && !stderr.includes('warning')) {
        logger.warning(stderr);
      }

      logger.success(`Successfully injected ${libraries.length} libraries:`);
      libraries.forEach((lib) => {
        logger.info(`  • ${lib}`);
      });
    } catch (error: any) {
      logger.error(`Failed to inject libraries: ${error.message}`);
      throw error;
    }
  }

  private getInstallCommand(framework: Framework, libraries: string[]): string {
    const packageManager = framework.packageManager;

    switch (packageManager) {
      case 'bun':
        return `bun add ${libraries.join(' ')}`;
      case 'npm':
        return `npm install ${libraries.join(' ')}`;
      case 'yarn':
        return `yarn add ${libraries.join(' ')}`;
      case 'pnpm':
        return `pnpm add ${libraries.join(' ')}`;
      case 'flutter':
        return `flutter pub add ${libraries.join(' ')}`;
      case 'deno':
        // Deno doesn't have a central package manager, libraries are imported via URLs
        logger.warning('Deno libraries are imported via URLs in code, not installed');
        return '';
      case 'cargo':
        return `cargo add ${libraries.join(' ')}`;
      case 'go':
        // Go uses go get
        return `go get ${libraries.join(' ')}`;
      default:
        logger.warning(`Unknown package manager: ${packageManager}`);
        return '';
    }
  }
}
