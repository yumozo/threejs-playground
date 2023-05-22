const path = require('path')

module.exports = {
  mode: 'development',
  entry: "./src/app.tsx",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.gltf/,
        type: 'asset/resource'
      },
      {
        test: /\.(bin)$/i,
        loader: 'file-loader',
        options: {
          // name: '[name].[contenthash].[ext]',
          name: '[name].[ext]',
          // outputPath: 'assets1',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          // name: '[name].[contenthash].[ext]',
          name: '[name].[ext]',
          outputPath: 'textures',
        },
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@context": path.resolve(__dirname, "src/context/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
      "@game": path.resolve(__dirname, "src/game/"),
      "@assets": path.resolve(__dirname, "src/assets/")
    }
  },
  output: {
    filename: "out.js",
    path: path.resolve(__dirname, 'dist')
  }
}