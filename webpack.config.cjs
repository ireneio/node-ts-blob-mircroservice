const path = require('path')
const nodeExternals = require('webpack-node-externals')
const Dotenv = require('dotenv-webpack')

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
  },
  plugins: [
    new Dotenv({
      path: './.env',
      safe: true,
      allowEmptyValues: true
    })
  ]
}

module.exports = config
