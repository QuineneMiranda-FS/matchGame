const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
    module.exports = {
      entry: './src/index.ts', // Your entry point
      module: {
        rules: [
          {
            test: /\.tsx?$/, // Apply ts-loader to .ts and .tsx files
            use: 'ts-loader',
            exclude: /node_modules/, // Exclude node_modules
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
      },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    extensions: [".js", ".scss", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/ // Test for .js files
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
