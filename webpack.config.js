const path = require("path");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"), 
    filename: "index_bundle.js"
  },
  module: {
    loaders: [
      { loader: "babel-loader", exclude: /node_modules/ }
    ]
}
};
