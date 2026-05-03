import { describe, it, expect } from 'bun:test';
import { getFrameworkById, getFrameworksByCategory, getAllCategories } from './framework-registry';
import { Randomizer } from './randomizer';

describe('Framework Registry', () => {
  it('should get framework by id', () => {
    const framework = getFrameworkById('react-vite');
    expect(framework).toBeDefined();
    expect(framework?.name).toBe('React (Vite)');
  });

  it('should get frameworks by category', () => {
    const webFrameworks = getFrameworksByCategory('web');
    expect(webFrameworks.length).toBeGreaterThan(0);
    expect(webFrameworks.every((f) => f.category === 'web')).toBe(true);
  });

  it('should get all categories', () => {
    const categories = getAllCategories();
    expect(categories).toContain('web');
    expect(categories).toContain('mobile');
    expect(categories).toContain('desktop');
    expect(categories).toContain('cli');
    expect(categories).toContain('backend');
  });
});

describe('Randomizer', () => {
  it('should select a framework', () => {
    const randomizer = new Randomizer(false);
    const framework = randomizer.selectFramework('web');
    expect(framework).toBeDefined();
    expect(framework.category).toBe('web');
  });

  it('should select libraries', () => {
    const randomizer = new Randomizer(false);
    const framework = getFrameworkById('react-vite');
    if (framework) {
      const libraries = randomizer.selectLibraries(framework, 2);
      expect(libraries.length).toBeLessThanOrEqual(2);
      expect(libraries.every((lib) => framework.compatibleLibraries.includes(lib))).toBe(true);
    }
  });

  it('should select features', () => {
    const randomizer = new Randomizer(false);
    const features = randomizer.selectFeatures('web', 2);
    expect(features.length).toBeLessThanOrEqual(2);
    expect(features.length).toBeGreaterThan(0);
  });

  it('should generate complete selection', () => {
    const randomizer = new Randomizer(false);
    const selection = randomizer.generate({
      chaosMode: false,
      includeLibraries: true,
      includeFeatures: true,
      libraryCount: 2,
    });

    expect(selection.framework).toBeDefined();
    expect(selection.libraries).toBeDefined();
    expect(selection.features).toBeDefined();
  });
});
