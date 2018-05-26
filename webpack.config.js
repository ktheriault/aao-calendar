var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + "/app/index.html",
    filename: "index.html",
    inject: "body"
});

module.exports = {
    entry: ["babel-polyfill", __dirname + "/app/index.js"],
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    output: {
        filename: "transformed.js",
        path: __dirname + "/build"
    },
    plugins: [HTMLWebpackPluginConfig]
};