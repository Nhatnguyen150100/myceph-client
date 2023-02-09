const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = ({ mode } = { mode: "production" }) => {
  console.log(`mode is: ${mode}`);
  return {
    mode,
    entry: "./src/index.jsx",
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "build"),
      filename: "bundled.js"
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico|ttf)$/,
          exclude: /node_modules/,
          use: ["url-loader", "file-loader"]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.css|scss$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    watchOptions: {
      ignored: '**/node_modules'
    },
    plugins: [
      new InterpolateHtmlPlugin({
        PUBLIC_URL: 'static' // can modify `static` to another name or get it from `process`
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        manifest: "./public/manifest.json"
      })
    ],
    devServer: {
      open: true
    }
  }
};