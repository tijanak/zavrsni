const { AngularWebpackPlugin } = require('@ngtools/webpack');
const path = require('path');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@ngtools/webpack',
      },
    ],
  },
  plugins: [
    new AngularWebpackPlugin({
      tsConfigPath: path.resolve(__dirname, 'frontend/tsconfig.app.json'),
      mainPath: path.resolve(__dirname, 'frontend/src/main.ts'),
    }),
    require('./plugins/env-var-plugin.js'),
  ],
};
