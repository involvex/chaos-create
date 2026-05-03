export interface Framework {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'desktop' | 'cli' | 'backend';
  cliCommand: string;
  cliArgs?: string[];
  packageManager: 'bun' | 'npm' | 'yarn' | 'pnpm' | 'flutter' | 'deno' | 'cargo' | 'go' | 'none';
  popularity: number; // 1-10, used for weighted randomization
  stability: number; // 1-10, used for weighted randomization
  compatibleLibraries: string[];
  builtInTemplates?: string[];
  gitTemplateSources?: string[];
  postInstallCommands?: string[];
}

export const FRAMEWORKS: Framework[] = [
  // Web Frameworks
  {
    id: 'react-vite',
    name: 'React (Vite)',
    category: 'web',
    cliCommand: 'bun',
    cliArgs: ['create', 'vite', '{projectName}', '--template', 'react'],
    packageManager: 'bun',
    popularity: 10,
    stability: 10,
    compatibleLibraries: [
      'react-router-dom',
      'axios',
      'zustand',
      'tailwindcss',
      'framer-motion',
      'react-query',
    ],
    builtInTemplates: ['basic', 'with-router', 'with-tailwind'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'web',
    cliCommand: 'bun',
    cliArgs: ['create', 'next-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 10,
    stability: 10,
    compatibleLibraries: ['next-auth', 'prisma', 'tailwindcss', 'framer-motion', 'react-query'],
    builtInTemplates: ['basic', 'with-tailwind', 'with-prisma'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'vue-vite',
    name: 'Vue (Vite)',
    category: 'web',
    cliCommand: 'bun',
    cliArgs: ['create', 'vite', '{projectName}', '--template', 'vue'],
    packageManager: 'bun',
    popularity: 8,
    stability: 9,
    compatibleLibraries: ['vue-router', 'pinia', 'axios', 'tailwindcss'],
    builtInTemplates: ['basic', 'with-router', 'with-tailwind'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'nuxt',
    name: 'Nuxt',
    category: 'web',
    cliCommand: 'bun',
    cliArgs: ['create', 'nuxt-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 8,
    stability: 9,
    compatibleLibraries: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/axios'],
    builtInTemplates: ['basic', 'with-tailwind'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'web',
    cliCommand: 'bun',
    cliArgs: ['create', 'vite', '{projectName}', '--template', 'svelte'],
    packageManager: 'bun',
    popularity: 7,
    stability: 8,
    compatibleLibraries: ['svelte-routing', 'svelte-store', 'axios', 'tailwindcss'],
    builtInTemplates: ['basic', 'with-router', 'with-tailwind'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'solid',
    name: 'SolidJS',
    category: 'web',
    cliCommand: 'bun',
    cliArgs: ['create', 'solid', '{projectName}'],
    packageManager: 'bun',
    popularity: 5,
    stability: 7,
    compatibleLibraries: ['@solidjs/router', 'solid-js', 'axios', 'tailwindcss'],
    builtInTemplates: ['basic', 'with-router', 'with-tailwind'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'web',
    cliCommand: 'ng',
    cliArgs: ['new', '{projectName}'],
    packageManager: 'npm',
    popularity: 7,
    stability: 9,
    compatibleLibraries: ['@angular/router', '@angular/common', 'rxjs'],
    builtInTemplates: ['basic'],
    postInstallCommands: ['npm install'],
  },

  // Mobile Frameworks
  {
    id: 'react-native',
    name: 'React Native',
    category: 'mobile',
    cliCommand: 'bun',
    cliArgs: ['create', 'react-native-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 9,
    stability: 8,
    compatibleLibraries: [
      '@react-navigation/native',
      'react-native-maps',
      'axios',
      '@react-native-async-storage/async-storage',
    ],
    builtInTemplates: ['basic', 'with-navigation'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'expo',
    name: 'Expo',
    category: 'mobile',
    cliCommand: 'bun',
    cliArgs: ['create', 'expo-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 9,
    stability: 9,
    compatibleLibraries: ['expo-router', 'expo-location', 'axios', 'expo-secure-store'],
    builtInTemplates: ['basic', 'with-router', 'with-tabs'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'expo-stack',
    name: 'Expo Stack',
    category: 'mobile',
    cliCommand: 'bun',
    cliArgs: ['create', 'expo-stack-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 8,
    stability: 8,
    compatibleLibraries: ['expo-router', 'expo-location', 'axios', 'expo-secure-store', 'solito'],
    builtInTemplates: ['basic', 'with-router', 'with-tabs'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'mobile',
    cliCommand: 'flutter',
    cliArgs: ['create', '{projectName}'],
    packageManager: 'flutter',
    popularity: 9,
    stability: 10,
    compatibleLibraries: ['provider', 'http', 'shared_preferences', 'flutter_bloc'],
    builtInTemplates: ['basic', 'with-state'],
    postInstallCommands: ['flutter pub get'],
  },

  // Desktop Frameworks
  {
    id: 'tauri',
    name: 'Tauri',
    category: 'desktop',
    cliCommand: 'bun',
    cliArgs: ['create', 'tauri-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 7,
    stability: 8,
    compatibleLibraries: ['react', 'vue', 'svelte', 'solid-js', 'axios'],
    builtInTemplates: ['basic', 'with-react', 'with-vue'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'electron',
    name: 'Electron',
    category: 'desktop',
    cliCommand: 'bun',
    cliArgs: ['create', 'electron-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 8,
    stability: 9,
    compatibleLibraries: ['electron', 'electron-builder', 'axios'],
    builtInTemplates: ['basic', 'with-react'],
    postInstallCommands: ['bun install'],
  },

  // CLI/Terminal Frameworks
  {
    id: 'ink',
    name: 'Ink (React CLI)',
    category: 'cli',
    cliCommand: 'bun',
    cliArgs: ['create', 'ink-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 6,
    stability: 7,
    compatibleLibraries: ['ink', 'ink-table', 'ink-spinner', 'axios'],
    builtInTemplates: ['basic', 'with-tables'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'tui',
    name: 'TUI Framework',
    category: 'cli',
    cliCommand: 'bun',
    cliArgs: ['create', 'tui-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 5,
    stability: 6,
    compatibleLibraries: ['blessed', 'chalk', 'ora', 'inquirer'],
    builtInTemplates: ['basic', 'with-forms'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'deno-cli',
    name: 'Deno CLI',
    category: 'cli',
    cliCommand: 'deno',
    cliArgs: ['init', '{projectName}'],
    packageManager: 'deno',
    popularity: 6,
    stability: 7,
    compatibleLibraries: ['std', 'cliffy', 'oak'],
    builtInTemplates: ['basic', 'with-server'],
    postInstallCommands: [],
  },

  // Backend Frameworks
  {
    id: 'deno',
    name: 'Deno',
    category: 'backend',
    cliCommand: 'deno',
    cliArgs: ['init', '{projectName}'],
    packageManager: 'deno',
    popularity: 7,
    stability: 8,
    compatibleLibraries: ['oak', 'std', 'postgres'],
    builtInTemplates: ['basic', 'with-oak', 'with-postgres'],
    postInstallCommands: [],
  },
  {
    id: 'bun-backend',
    name: 'Bun Backend',
    category: 'backend',
    cliCommand: 'bun',
    cliArgs: ['create', 'bun-backend', '{projectName}'],
    packageManager: 'bun',
    popularity: 8,
    stability: 8,
    compatibleLibraries: ['elysia', 'drizzle-orm', 'postgres', 'zod'],
    builtInTemplates: ['basic', 'with-elysia', 'with-drizzle'],
    postInstallCommands: ['bun install'],
  },
  {
    id: 'node-express',
    name: 'Node.js Express',
    category: 'backend',
    cliCommand: 'bun',
    cliArgs: ['create', 'express-app', '{projectName}'],
    packageManager: 'bun',
    popularity: 9,
    stability: 10,
    compatibleLibraries: ['express', 'mongoose', 'cors', 'dotenv'],
    builtInTemplates: ['basic', 'with-mongo', 'with-sql'],
    postInstallCommands: ['bun install'],
  },
];

export function getFrameworkById(id: string): Framework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}

export function getFrameworksByCategory(category: Framework['category']): Framework[] {
  return FRAMEWORKS.filter((f) => f.category === category);
}

export function getAllCategories(): Framework['category'][] {
  return [...new Set(FRAMEWORKS.map((f) => f.category))];
}
