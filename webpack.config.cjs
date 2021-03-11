const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
  target: 'node',
  externals: [nodeExternals()],
  externalsType: "import",
  devtool: 'inline-source-map',
  entry: {
    'app': './bin/www.ts'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
    ],
  },
  experiments: {
    topLevelAwait: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      http: require.resolve("http")
    }
  }
}

module.exports = config
