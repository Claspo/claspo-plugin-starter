const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// Constants
const COMPONENTS_DIR = './components';
const ASSETS_FOLDER = 'assets';
const DIST_FOLDER = 'bundled-components';
const NPM_PACKAGE_NAME = '@claspo/components';

// Load config
const claspoConfig = require('./claspo.config.js');

// Helper functions
const componentFolderName = (name) =>
  name.includes('Component') ? name : `${name}Component`;

const getComponentsAndFiles = () => {
  const componentNames = [];
  const fileNames = [];
  const onlyComponents = true;
  const excludedFolders = ['global-assets']; // Folders to exclude from component processing

  if (!fsSync.existsSync(COMPONENTS_DIR)) {
    console.warn(`Folder ${COMPONENTS_DIR} does not exist.`);
    return {componentNames, fileNames};
  }

  const files = fsSync.readdirSync(COMPONENTS_DIR);

  files.forEach(file => {
    const filePath = path.join(COMPONENTS_DIR, file);
    const stats = fsSync.statSync(filePath);

    if (stats.isDirectory() && !excludedFolders.includes(file)) {
      componentNames.push(file);
    } else if (!onlyComponents && !stats.isDirectory()) {
      fileNames.push(file);
    }
  });

  return {componentNames, fileNames};
};

const buildEntryPoints = (componentNames, fileNames) => {
  const componentEntries = componentNames.reduce((acc, name) => ({
    ...acc,
    [`${componentFolderName(name)}/${name}.js`]: `./${COMPONENTS_DIR}/${name}/${name}.js`
  }), {});

  const fileEntries = fileNames.reduce((acc, name) => ({
    ...acc,
    [name]: `./${COMPONENTS_DIR}/${name}`
  }), {});

  return {...componentEntries, ...fileEntries};
};

const createCopyPatterns = (componentNames, npmComponents = []) => {
  const assetPatterns = componentNames.map(componentName => ({
    from: `${COMPONENTS_DIR}/${componentName}/${ASSETS_FOLDER}`,
    to: `${componentFolderName(componentName)}/${ASSETS_FOLDER}`,
    noErrorOnMissing: true,
  }));

  const npmPatterns = npmComponents.map(name => ({
    from: `node_modules/${NPM_PACKAGE_NAME}/${name}`,
    to: name,
    noErrorOnMissing: true,
  }));

  const globalAssetsPattern = {
    from: `${COMPONENTS_DIR}/global-assets`,
    to: 'global-assets',
    noErrorOnMissing: true,
  };

  return [...assetPatterns, ...npmPatterns, globalAssetsPattern];
};

// Custom webpack plugin for window assignment
class ComponentWindowAssignmentPlugin {
  constructor(componentNames, isDevMode) {
    this.componentNames = componentNames;
    this.isDevMode = isDevMode;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ComponentWindowAssignmentPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ComponentWindowAssignmentPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        (assets) => {
          this.componentNames.forEach(name => {
            const assetName = `${componentFolderName(name)}/${name}.js`;

            if (assets[assetName]) {
              let source = assets[assetName].source();
              
              // Find the export pattern: export {variable as default}
              const exportMatch = source.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/);
              
              if (exportMatch) {
                const exportedVar = exportMatch[1];
                // Replace the existing incorrect window assignment or add a new one
                const windowAssignment = `window.clComponentClass_${componentFolderName(name)} = ${exportedVar};`;
                
                // Check if there's already a window assignment to replace
                const existingWindowPattern = new RegExp(`window\\.clComponentClass_${componentFolderName(name)}\\s*=\\s*[^;]+;`, 'g');
                
                if (existingWindowPattern.test(source)) {
                  // Replace existing assignment
                  source = source.replace(existingWindowPattern, windowAssignment);
                } else {
                  // Add new assignment after the export
                  source = source.replace(
                    /export\s*\{\s*\w+\s+as\s+default\s*\};?/,
                    `$&\n${windowAssignment}`
                  );
                }
              }

              assets[assetName] = new webpack.sources.RawSource(source);
            }
          });
        }
      );
    });
  }
}

// Clean plugin to remove old builds
class CleanPlugin {
  constructor(outputPath) {
    this.outputPath = outputPath;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('CleanPlugin', async (compilation, callback) => {
      if (fsSync.existsSync(this.outputPath)) {
        try {
          await fs.rm(this.outputPath, {recursive: true, force: true});
          await fs.mkdir(this.outputPath, {recursive: true});
        } catch (err) {
          console.warn('Error cleaning output directory:', err);
        }
      }
      callback();
    });
  }
}

// Main configuration
const {componentNames, fileNames} = getComponentsAndFiles();
const isDevMode = process.env.dev === '1';
const npmComponents = claspoConfig.useComponents || [];
const entryPoints = buildEntryPoints(componentNames, fileNames);

console.log('Components:', componentNames);
console.log('Files:', fileNames);
console.log('NPM Components:', npmComponents);
console.log('Entry points:', Object.keys(entryPoints));


module.exports = {
  mode: isDevMode ? 'development' : 'production',

  devtool: isDevMode ? 'eval-source-map' : false,

  optimization: {
    minimize: !isDevMode,
  },

  experiments: {
    outputModule: true,
  },

  entry: entryPoints,

  output: {
    filename: '[name]',
    path: path.resolve(__dirname, DIST_FOLDER),
    module: true,
    library: {
      type: 'module',
    },
    clean: true, // Clean output folder before each build
  },

  devServer: {
    port: 9590,
    static: {
      directory: path.resolve(__dirname, DIST_FOLDER),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    compress: true,
    hot: false, // Disable HMR for module federation
    liveReload: true,
    watchFiles: ['components/**/*'],
    client: {
      logging: 'info', // Explicitly set client logging level
      overlay: false, // Disable error overlay
    },
    onListening: function (devServer) {
      const port = devServer.server.address().port;
      console.log(`
╔════════════════════════════════════════════╗
║     Webpack Dev Server - Components        ║
╠════════════════════════════════════════════╣
║ Mode: development                          ║
║ Port: ${String(port).padEnd(37)}║
╚════════════════════════════════════════════╝

Server running at http://localhost:${port}

Example URLs:
  Components: http://localhost:${port}/[ComponentName]/[file.js]
  Assets: http://localhost:${port}/[ComponentName]/assets/*
  Global assets: http://localhost:${port}/global-assets/*
      `);
    }
  },

  resolve: {
    extensions: ['.ts', '.js'],
    cache: false, // Disable resolver cache to avoid stale resolution
  },

  cache: false,

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: isDevMode, // Speed up dev builds
            experimentalWatchApi: isDevMode,
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-class-properties'],
            cacheDirectory: isDevMode, // Enable babel cache in dev mode
          },
        },
      },
    ],
  },

  plugins: [
    // Clean output directory before build
    new CleanPlugin(path.resolve(__dirname, DIST_FOLDER)),

    // Copy assets
    new CopyWebpackPlugin({
      patterns: createCopyPatterns(componentNames, npmComponents),
    }),

    // Add window assignments
    new ComponentWindowAssignmentPlugin(componentNames, isDevMode),

    // Progress plugin for better feedback
    isDevMode && new webpack.ProgressPlugin({
      activeModules: true,
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: false,
      dependencies: true,
      dependenciesCount: 100,
    }),
  ].filter(Boolean),

  optimization: {
    minimize: !isDevMode,
    sideEffects: false,
    usedExports: true,
  },

  watchOptions: isDevMode ? {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: false,
  } : undefined,

  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    timings: true,
    errors: true,
    warnings: true,
  },

  performance: {
    hints: false,
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
  },
};
