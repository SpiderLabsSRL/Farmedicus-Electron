import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource: [
      './backend'
    ],
    // Excluir node_modules del backend y otros archivos innecesarios
    ignore: [
      /backend[/\\]node_modules/,
      /\.git/,
      /\.vscode/,
      /\.DS_Store/,
      /Thumbs\.db/,
      /\.env\./,
      /README\.md$/,
      /\.gitignore$/
    ]
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ['win32']),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;