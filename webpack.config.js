module.exports = {
  entry: {
    index: "./tester/frontend/src/index.js",
    table: "./tester/frontend/src/table.js"
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
