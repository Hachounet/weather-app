const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1
  entry: './src/index.js',
  // 2
  output: {
    path: path.resolve(__dirname, 'dist'), // Chemin de sortie corrigé
    filename: 'bundle.js',
    clean: true,
  },
  target: "web",
  // 3
  devServer: {
    static: path.join(__dirname, "dist"),
    watchFiles: ["./src/**/*"],
    hot: true,
    liveReload: true,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "Template",
      myPageHeader: "Hello template",
      template: "./src/index.html",
      filename: "./index.html",
    }),
  ],
  module: { // Utilisation correcte des règles dans le contexte du module
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ]
  }
};