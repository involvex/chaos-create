import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface GitTemplate {
  url: string;
  branch?: string;
  subdirectory?: string;
}

export class GitTemplateManager {
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(process.cwd(), '.chaos-templates-cache');
  }

  async pullTemplate(
    template: GitTemplate,
    projectName: string,
    outputDir: string
  ): Promise<string> {
    const templateName = this.getTemplateName(template.url);
    const cachePath = path.join(this.cacheDir, templateName);
    const projectPath = path.join(outputDir, projectName);

    logger.info(`Pulling template from ${template.url}...`);

    try {
      // Create cache directory if it doesn't exist
      await fs.mkdir(this.cacheDir, { recursive: true });

      // Clone or update the template
      if (await this.directoryExists(cachePath)) {
        logger.info('Updating cached template...');
        await execAsync(`git -C "${cachePath}" pull origin ${template.branch || 'main'}`);
      } else {
        logger.info('Cloning template...');
        const branchFlag = template.branch ? `--branch ${template.branch}` : '';
        await execAsync(`git clone --depth 1 ${branchFlag} "${template.url}" "${cachePath}"`);
      }

      // Copy template to project directory
      const sourceDir = template.subdirectory
        ? path.join(cachePath, template.subdirectory)
        : cachePath;

      logger.info('Copying template files...');
      await this.copyDirectory(sourceDir, projectPath);

      // Clean up git metadata
      await this.cleanGitMetadata(projectPath);

      logger.success(`Template created at: ${projectPath}`);
      return projectPath;
    } catch (error: any) {
      logger.error(`Failed to pull template: ${error.message}`);
      throw error;
    }
  }

  async listTemplatesFromRepo(repoUrl: string): Promise<string[]> {
    try {
      logger.info(`Fetching templates from ${repoUrl}...`);

      const tempDir = path.join(this.cacheDir, 'temp-' + Date.now());
      await fs.mkdir(tempDir, { recursive: true });

      await execAsync(`git clone --depth 1 "${repoUrl}" "${tempDir}"`);

      const templates: string[] = [];
      const entries = await fs.readdir(tempDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          templates.push(entry.name);
        }
      }

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });

      return templates;
    } catch (error: any) {
      logger.error(`Failed to list templates: ${error.message}`);
      throw error;
    }
  }

  async validateTemplate(template: GitTemplate): Promise<boolean> {
    try {
      // Try to fetch the repository
      const tempDir = path.join(this.cacheDir, 'validate-' + Date.now());
      await fs.mkdir(tempDir, { recursive: true });

      const branchFlag = template.branch ? `--branch ${template.branch}` : '';
      await execAsync(`git clone --depth 1 ${branchFlag} "${template.url}" "${tempDir}"`);

      // Check if it's a valid template (has package.json or similar)
      const sourceDir = template.subdirectory ? path.join(tempDir, template.subdirectory) : tempDir;

      const packageJsonPath = path.join(sourceDir, 'package.json');
      const isValid = await this.fileExists(packageJsonPath);

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });

      return isValid;
    } catch (error: any) {
      logger.warning(`Template validation failed: ${error.message}`);
      return false;
    }
  }

  async clearCache(): Promise<void> {
    try {
      logger.info('Clearing template cache...');
      await fs.rm(this.cacheDir, { recursive: true, force: true });
      logger.success('Cache cleared');
    } catch (error: any) {
      logger.error(`Failed to clear cache: ${error.message}`);
      throw error;
    }
  }

  private getTemplateName(url: string): string {
    // Extract repository name from URL
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    if (!lastPart) {
      throw new Error('Invalid URL: could not extract repository name');
    }
    return lastPart.replace('.git', '');
  }

  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      await fs.access(dirPath);
      return true;
    } catch {
      return false;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async copyDirectory(source: string, destination: string): Promise<void> {
    await fs.mkdir(destination, { recursive: true });

    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        // Skip .git directory
        if (entry.name === '.git') {
          continue;
        }
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  private async cleanGitMetadata(projectPath: string): Promise<void> {
    try {
      const gitDir = path.join(projectPath, '.git');
      if (await this.directoryExists(gitDir)) {
        await fs.rm(gitDir, { recursive: true, force: true });
      }

      // Remove .gitignore if it exists (will be regenerated)
      const gitignorePath = path.join(projectPath, '.gitignore');
      if (await this.fileExists(gitignorePath)) {
        await fs.rm(gitignorePath);
      }
    } catch (error: any) {
      logger.warning(`Failed to clean git metadata: ${error.message}`);
    }
  }

  parseGitUrl(url: string): GitTemplate {
    // Parse GitHub URLs
    const githubMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (githubMatch) {
      const [, owner, repo] = githubMatch;
      return {
        url: `https://github.com/${owner}/${repo}.git`,
      };
    }

    // Parse GitLab URLs
    const gitlabMatch = url.match(/gitlab\.com\/([^/]+)\/([^/]+)/);
    if (gitlabMatch) {
      const [, owner, repo] = gitlabMatch;
      return {
        url: `https://gitlab.com/${owner}/${repo}.git`,
      };
    }

    // Assume it's already a valid git URL
    return {
      url: url.endsWith('.git') ? url : `${url}.git`,
    };
  }

  async getPopularTemplates(): Promise<GitTemplate[]> {
    // List of popular starter templates
    return [
      {
        url: 'https://github.com/vitejs/vite-react-ts-starter.git',
      },
      {
        url: 'https://github.com/vercel/next.js-starter.git',
      },
      {
        url: 'https://github.com/facebook/create-react-app.git',
      },
      {
        url: 'https://github.com/vuejs/vue-starter.git',
      },
      {
        url: 'https://github.com/sveltejs/svelte-starter.git',
      },
    ];
  }
}
