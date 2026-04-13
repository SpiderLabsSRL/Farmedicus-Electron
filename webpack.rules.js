module.exports = {
  rules: [
    // ✅ SOPORTE PARA MÓDULOS NATIVOS (CLAVE)
    {
      test: /native_modules[/\\].+\.node$/,
      use: "node-loader",
    },
    {
      test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
      parser: { amd: false },
      use: {
        loader: "@vercel/webpack-asset-relocator-loader",
        options: {
          outputAssetBase: "native_modules",
        },
      },
    },

    // TS / TSX
    {
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|\.webpack)/,
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          compilerOptions: {
            jsx: "react-jsx",
          },
        },
      },
    },
  ],
};
