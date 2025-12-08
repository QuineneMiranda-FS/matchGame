const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts", // Your entry point
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Apply ts-loader to .ts and .tsx files
        use: "ts-loader",
        exclude: /node_modules/, // Exclude node_modules
      },
      {
        test: /\.js|\.jsx$/, // Test for .js and .jsx files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: "babel-loader", // Use Babel to transpile ES6 to ES5
          options: {
            presets: ["@babel/preset-env"], // Babel preset for ES6+ features
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".scss", ".css"], // Resolve these extensions and combine them
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    compress: false,
    port: 9000,
    hot: true,
    static: "./build",
    open: true,
  },
  mode: "development",
};
