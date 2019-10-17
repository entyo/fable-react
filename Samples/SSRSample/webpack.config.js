var path = require("path");
var webpack = require("webpack");

// https://www.npmjs.com/package/fable-loader#usage
var CONFIG = {
  fsharpEntry: "./src/Client/Client.fsproj",
  outputDir: "./src/Client/public",
  assetsDir: "./src/Client",
  devServerPort: 8080,
  devServerProxy: {
    "/api/*": {
      target: "http://localhost:8085"
    }
  },
  // Use babel-preset-env to generate JS compatible with most-used browsers.
  // More info at https://babeljs.io/docs/en/next/babel-preset-env.html
  babel: {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          useBuiltIns: "usage",
          corejs: 3
        }
      ]
    ]
  }
};

// If we're running the webpack-dev-server, assume we're in development mode
var isProduction = !process.argv.find(
  v => v.indexOf("webpack-dev-server") !== -1
);
console.log(
  "Bundling for " + (isProduction ? "production" : "development") + "..."
);

module.exports = {
  entry: resolve(CONFIG.fsharpEntry),
  output: {
    path: resolve(CONFIG.outputDir),
    filename: "bundle.js"
  },
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "eval-source-map",
  plugins: isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    publicPath: "/public",
    contentBase: resolve(CONFIG.assetsDir),
    host: "0.0.0.0",
    port: CONFIG.devServerPort,
    proxy: CONFIG.devServerProxy,
    hot: true,
    inline: true
  },
  module: {
    rules: [
      {
        test: /\.fs(x|proj)?$/,
        use: {
          loader: "fable-loader",
          options: {
            babel: CONFIG.babel
          }
        }
      }
    ]
  }
};

function resolve(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
}
