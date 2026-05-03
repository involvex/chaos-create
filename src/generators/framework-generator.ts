import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import type { Framework } from '../framework-registry';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export class FrameworkGenerator {
  async generate(framework: Framework, projectName: string, outputDir: string): Promise<string> {
    const projectPath = path.join(outputDir, projectName);
    const command = this.buildCommand(framework, projectName);

    logger.info(`Creating ${framework.name} project...`);
    logger.info(`Command: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: outputDir,
        env: { ...process.env, FORCE_COLOR: '1' },
      });

      if (stdout) {
        logger.info(stdout);
      }

      if (stderr && !stderr.includes('warning')) {
        logger.warning(stderr);
      }

      logger.success(`Project created at: ${projectPath}`);
      return projectPath;
    } catch (error: any) {
      logger.error(`Failed to create project: ${error.message}`);
      throw error;
    }
  }

  async installDependencies(framework: Framework, projectPath: string): Promise<void> {
    if (!framework.postInstallCommands || framework.postInstallCommands.length === 0) {
      logger.info('No post-install commands defined for this framework');
      return;
    }

    logger.info('Installing dependencies...');

    for (const command of framework.postInstallCommands) {
      try {
        logger.info(`Running: ${command}`);
        const { stdout, stderr } = await execAsync(command, {
          cwd: projectPath,
          env: { ...process.env, FORCE_COLOR: '1' },
        });

        if (stdout) {
          logger.info(stdout);
        }

        if (stderr && !stderr.includes('warning')) {
          logger.warning(stderr);
        }

        logger.success('Dependencies installed successfully');
      } catch (error: any) {
        logger.error(`Failed to install dependencies: ${error.message}`);
        throw error;
      }
    }
  }

  async startDevServer(framework: Framework, projectPath: string): Promise<void> {
    const devCommand = this.getDevCommand(framework);

    if (!devCommand) {
      logger.warning('No dev server command available for this framework');
      return;
    }

    logger.info(`Starting dev server: ${devCommand}`);
    logger.info('Press Ctrl+C to stop the server');

    try {
      const child = exec(devCommand, {
        cwd: projectPath,
        env: { ...process.env, FORCE_COLOR: '1' },
      });

      child.stdout?.on('data', (data) => {
        console.log(data.toString());
      });

      child.stderr?.on('data', (data) => {
        console.error(data.toString());
      });

      child.on('close', (code) => {
        logger.info(`Dev server exited with code ${code}`);
      });
    } catch (error: any) {
      logger.error(`Failed to start dev server: ${error.message}`);
      throw error;
    }
  }

  private buildCommand(framework: Framework, projectName: string): string {
    const args = framework.cliArgs || [];
    const processedArgs = args.map((arg) => arg.replace('{projectName}', projectName));
    return `${framework.cliCommand} ${processedArgs.join(' ')}`;
  }

  private getDevCommand(framework: Framework): string | null {
    const devCommands: Record<string, string> = {
      'react-vite': 'bun run dev',
      nextjs: 'bun run dev',
      'vue-vite': 'bun run dev',
      nuxt: 'bun run dev',
      svelte: 'bun run dev',
      solid: 'bun run dev',
      angular: 'ng serve',
      'react-native': 'bun start',
      expo: 'bun start',
      'expo-stack': 'bun start',
      flutter: 'flutter run',
      tauri: 'bun run tauri dev',
      electron: 'bun run dev',
      ink: 'bun run dev',
      tui: 'bun run dev',
      'deno-cli': 'deno run --allow-net main.ts',
      deno: 'deno run --allow-net main.ts',
      'bun-backend': 'bun run dev',
      'node-express': 'bun run dev',
    };

    return devCommands[framework.id] || null;
  }
}
