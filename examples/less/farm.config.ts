import type { UserConfig } from '@farmfe/core';
import farmLessPlugin from '@farmfe/js-plugin-less';
import path from 'path';

function defineConfig(config: UserConfig) {
  return config;
}

export default defineConfig({
  compilation: {
    input: {
      index: './index.html',
    },
    resolve: {
      symlinks: true,
    },
    define: {
      BTN: 'Click me',
    },
    output: {
      path: './build',
    },
    sourcemap: false
    // treeShaking: true,
    // minify: true,
  },
  server: {
    hmr: true,
  },
  plugins: ['@farmfe/plugin-react',farmLessPlugin({
    additionalData: (content:string, resolvePath:string) => {
      if (path.basename(resolvePath,'.less') === 'index') {
        return `@hoverColor: #f10215;` + content;
      }
      return content;
    },
  }) ],
});
