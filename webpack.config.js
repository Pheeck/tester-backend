var path = require("path")

module.exports = {
  entry: {
    index: "./tester/frontend/src/index.js"
  },
  output: {
    path: path.resolve("./tester/frontend/static/frontend/")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ],
  }
};
