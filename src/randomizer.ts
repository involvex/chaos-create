import type { Framework } from './framework-registry';
import { getFrameworksByCategory } from './framework-registry';

export interface RandomizationOptions {
  category?: Framework['category'];
  frameworkId?: string;
  chaosMode: boolean;
  includeLibraries: boolean;
  includeFeatures: boolean;
  libraryCount?: number;
}

export interface RandomSelection {
  framework: Framework;
  libraries: string[];
  features: string[];
  template?: string;
}

export class Randomizer {
  private chaosMode: boolean;

  constructor(chaosMode: boolean = false) {
    this.chaosMode = chaosMode;
  }

  selectFramework(category?: Framework['category'], frameworkId?: string): Framework {
    if (frameworkId) {
      const framework = this.getFrameworkById(frameworkId);
      if (!framework) {
        throw new Error(`Framework with id "${frameworkId}" not found`);
      }
      return framework;
    }

    let candidates = category ? getFrameworksByCategory(category) : this.getAllFrameworks();

    if (candidates.length === 0) {
      throw new Error(`No frameworks found for category: ${category}`);
    }

    // Weighted randomization based on popularity and stability
    const weights = candidates.map((f) => {
      const baseWeight = f.popularity * f.stability;
      // In chaos mode, add more randomness
      return this.chaosMode ? baseWeight * Math.random() * 2 : baseWeight;
    });

    return this.weightedRandom(candidates, weights);
  }

  selectLibraries(framework: Framework, count: number = 3): string[] {
    if (framework.compatibleLibraries.length === 0) {
      return [];
    }

    const availableLibs = [...framework.compatibleLibraries];
    const selected: string[] = [];

    for (let i = 0; i < Math.min(count, availableLibs.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableLibs.length);
      const lib = availableLibs.splice(randomIndex, 1)[0];
      if (lib) {
        selected.push(lib);
      }
    }

    return selected;
  }

  selectFeatures(category: Framework['category'], count: number = 2): string[] {
    const features = this.getFeaturesForCategory(category);
    const selected: string[] = [];

    for (let i = 0; i < Math.min(count, features.length); i++) {
      const randomIndex = Math.floor(Math.random() * features.length);
      const feature = features.splice(randomIndex, 1)[0];
      if (feature) {
        selected.push(feature);
      }
    }

    return selected;
  }

  selectTemplate(framework: Framework): string | undefined {
    if (!framework.builtInTemplates || framework.builtInTemplates.length === 0) {
      return undefined;
    }

    // In chaos mode, randomly pick any template
    if (this.chaosMode) {
      return framework.builtInTemplates[
        Math.floor(Math.random() * framework.builtInTemplates.length)
      ];
    }

    // Otherwise, prefer 'basic' template
    if (framework.builtInTemplates.includes('basic')) {
      return 'basic';
    }

    return framework.builtInTemplates[0];
  }

  generate(options: RandomizationOptions): RandomSelection {
    const framework = this.selectFramework(options.category, options.frameworkId);
    const libraries = options.includeLibraries
      ? this.selectLibraries(framework, options.libraryCount)
      : [];
    const features = options.includeFeatures ? this.selectFeatures(framework.category) : [];
    const template = this.selectTemplate(framework);

    return {
      framework,
      libraries,
      features,
      template,
    };
  }

  private getFrameworkById(id: string): Framework | undefined {
    return this.getAllFrameworks().find((f) => f.id === id);
  }

  private getAllFrameworks(): Framework[] {
    // This would be imported from framework-registry
    const { FRAMEWORKS } = require('./framework-registry');
    return FRAMEWORKS;
  }

  private weightedRandom<T>(items: T[], weights: number[]): T {
    if (items.length === 0) {
      throw new Error('Cannot select from empty array');
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      const weight = weights[i];
      const item = items[i];
      if (weight !== undefined && item !== undefined && random < weight) {
        return item;
      }
      if (weight !== undefined) {
        random -= weight;
      }
    }

    const lastItem = items[items.length - 1];
    if (lastItem === undefined) {
      throw new Error('Failed to select random item');
    }
    return lastItem;
  }

  private getFeaturesForCategory(category: Framework['category']): string[] {
    const featureSets: Record<Framework['category'], string[]> = {
      web: [
        'User authentication',
        'Real-time data updates',
        'File upload/download',
        'Dark mode support',
        'Responsive design',
        'SEO optimization',
        'Analytics dashboard',
        'Multi-language support',
        'Payment integration',
        'Social media sharing',
      ],
      mobile: [
        'Push notifications',
        'Offline support',
        'Camera integration',
        'GPS/location services',
        'Biometric authentication',
        'In-app purchases',
        'Background sync',
        'Deep linking',
        'App shortcuts',
        'Widget support',
      ],
      desktop: [
        'System tray integration',
        'Auto-updates',
        'File system access',
        'Native notifications',
        'Window management',
        'Keyboard shortcuts',
        'Drag and drop',
        'Clipboard integration',
        'Screen capture',
        'Custom themes',
      ],
      cli: [
        'Interactive prompts',
        'Progress indicators',
        'Color output',
        'Configuration files',
        'Command history',
        'Auto-completion',
        'Plugin system',
        'Async operations',
        'Error handling',
        'Help documentation',
      ],
      backend: [
        'REST API',
        'Database integration',
        'Authentication',
        'Rate limiting',
        'Caching',
        'Logging',
        'Error monitoring',
        'Webhook support',
        'File storage',
        'Background jobs',
      ],
    };

    return featureSets[category] || [];
  }
}
