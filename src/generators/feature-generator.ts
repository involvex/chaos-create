import type { Framework } from '../framework-registry';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export class FeatureGenerator {
  async generateFeatures(
    framework: Framework,
    projectPath: string,
    features: string[]
  ): Promise<void> {
    if (features.length === 0) {
      logger.info('No features to generate');
      return;
    }

    logger.info(`Generating ${features.length} random features with working examples...`);

    for (const feature of features) {
      try {
        await this.generateFeature(framework, projectPath, feature);
        logger.success(`Generated feature: ${feature}`);
      } catch (error: any) {
        logger.error(`Failed to generate feature "${feature}": ${error.message}`);
      }
    }
  }

  private async generateFeature(
    framework: Framework,
    projectPath: string,
    feature: string
  ): Promise<void> {
    const featureCode = this.getFeatureCode(framework, feature);

    if (!featureCode) {
      logger.warning(`No code template available for feature: ${feature}`);
      return;
    }

    const filePath = this.getFeatureFilePath(framework, projectPath, feature);
    const dirPath = path.dirname(filePath);

    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, featureCode, 'utf-8');
  }

  private getFeatureFilePath(framework: Framework, projectPath: string, feature: string): string {
    const featureSlug = feature.toLowerCase().replace(/[^a-z0-9]/g, '-');

    switch (framework.category) {
      case 'web':
        return path.join(projectPath, 'src', 'features', `${featureSlug}.tsx`);
      case 'mobile':
        return path.join(projectPath, 'src', 'features', `${featureSlug}.tsx`);
      case 'desktop':
        return path.join(projectPath, 'src', 'features', `${featureSlug}.tsx`);
      case 'cli':
        return path.join(projectPath, 'src', 'commands', `${featureSlug}.ts`);
      case 'backend':
        return path.join(projectPath, 'src', 'features', `${featureSlug}.ts`);
      default:
        return path.join(projectPath, 'src', `${featureSlug}.ts`);
    }
  }

  private getFeatureCode(framework: Framework, feature: string): string | null {
    const featureTemplates: Record<string, Record<string, string>> = {
      'User authentication': {
        web: `import { useState } from 'react';

export function AuthFeature() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = async () => {
    // Simulate login
    setUser({ name: 'Chaos User', email: 'chaos@example.com' });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <h2>Login</h2>
        <button onClick={login}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Welcome, {user?.name}!</h2>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}`,
        mobile: `import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function AuthFeature() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = () => {
    setUser({ name: 'Chaos User', email: 'chaos@example.com' });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Button title="Sign In" onPress={login} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name}!</Text>
      <Button title="Sign Out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 }
});`,
        backend: `import { Router } from 'express';

export function authFeature(router: Router) {
  // Login endpoint
  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Simulate authentication
    if (email && password) {
      res.json({
        success: true,
        user: { id: 1, email, name: 'Chaos User' },
        token: 'chaos-token-' + Date.now()
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
  });

  // Logout endpoint
  router.post('/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Get current user
  router.get('/auth/me', (req, res) => {
    res.json({
      success: true,
      user: { id: 1, email: 'chaos@example.com', name: 'Chaos User' }
    });
  });
}`,
      },
      'Real-time data updates': {
        web: `import { useState, useEffect } from 'react';

export function RealTimeFeature() {
  const [data, setData] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Simulate WebSocket connection
    setConnectionStatus('connected');

    const interval = setInterval(() => {
      setData(prev => [...prev.slice(-9), {
        id: Date.now(),
        message: \`Update at \${new Date().toLocaleTimeString()}\`,
        timestamp: new Date().toISOString()
      }]);
    }, 2000);

    return () => {
      clearInterval(interval);
      setConnectionStatus('disconnected');
    };
  }, []);

  return (
    <div className="realtime-container">
      <h3>Real-time Updates</h3>
      <div className={\`status \${connectionStatus}\`}>
        Status: {connectionStatus}
      </div>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.message} <small>({item.timestamp})</small>
          </li>
        ))}
      </ul>
    </div>
  );`,
        mobile: `import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export function RealTimeFeature() {
  const [data, setData] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    setConnectionStatus('connected');

    const interval = setInterval(() => {
      setData(prev => [...prev.slice(-9), {
        id: Date.now(),
        message: \`Update at \${new Date().toLocaleTimeString()}\`,
        timestamp: new Date().toISOString()
      }]);
    }, 2000);

    return () => {
      clearInterval(interval);
      setConnectionStatus('disconnected');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-time Updates</Text>
      <Text style={styles.status}>Status: {connectionStatus}</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.message}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  status: { fontSize: 16, marginBottom: 10, color: '#666' },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  timestamp: { fontSize: 12, color: '#999' }
});`,
        backend: `import { Server } from 'socket.io';

export function realTimeFeature(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send real-time updates every 2 seconds
    const interval = setInterval(() => {
      socket.emit('update', {
        id: Date.now(),
        message: \`Update at \${new Date().toLocaleTimeString()}\`,
        timestamp: new Date().toISOString()
      });
    }, 2000);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clearInterval(interval);
    });
  });
}`,
      },
      'REST API': {
        backend: `import { Router, Request, Response } from 'express';

export function restApiFeature(router: Router) {
  // GET all items
  router.get('/api/items', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: [
        { id: 1, name: 'Item 1', description: 'First item' },
        { id: 2, name: 'Item 2', description: 'Second item' },
        { id: 3, name: 'Item 3', description: 'Third item' }
      ]
    });
  });

  // GET single item
  router.get('/api/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({
      success: true,
      data: { id: parseInt(id), name: \`Item \${id}\`, description: \`Item \${id} description\` }
    });
  });

  // POST new item
  router.post('/api/items', (req: Request, res: Response) => {
    const { name, description } = req.body;
    res.status(201).json({
      success: true,
      data: { id: Date.now(), name, description }
    });
  });

  // PUT update item
  router.put('/api/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    res.json({
      success: true,
      data: { id: parseInt(id), name, description }
    });
  });

  // DELETE item
  router.delete('/api/items/:id', (req: Request, res: Response) => {
    res.json({ success: true, message: \`Item \${req.params.id} deleted\` });
  });
}`,
      },
      'Interactive prompts': {
        cli: `import inquirer from 'inquirer';

export async function interactivePromptsFeature() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?'
    },
    {
      type: 'list',
      name: 'favoriteColor',
      message: 'What is your favorite color?',
      choices: ['Red', 'Blue', 'Green', 'Yellow']
    },
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Do you want to continue?',
      default: true
    }
  ]);

  console.log('Your answers:', answers);
  return answers;
}`,
      },
    };

    const categoryTemplates = featureTemplates[feature];
    if (!categoryTemplates) {
      return null;
    }

    return categoryTemplates[framework.category] || categoryTemplates['web'] || null;
  }
}
