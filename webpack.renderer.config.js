const path = require('path');
const { rules } = require('./webpack.rules');
const { plugins } = require('./webpack.plugins');

module.exports = {
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@pages': path.resolve(__dirname, 'src/renderer/pages'),
      '@hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@lib': path.resolve(__dirname, 'src/renderer/lib'),
      '@api': path.resolve(__dirname, 'src/renderer/api'),
      '@data': path.resolve(__dirname, 'src/renderer/data'),
    },
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
  },
};