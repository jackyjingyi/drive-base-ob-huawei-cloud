const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "index.js",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|svg|bmp|webp|gif|tiff)$/,
                exclude: /node_modules/,
                use: ["url-loader"],
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }
        ],
        // loaders: [
        //     {
        //         test: /\.(png|jpg|jpeg|svg|bmp|webp|gif|tiff)$/,
        //         loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        //     }
        // ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
        fallback: {
            fs: false
        },
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
    },
    // node: {
    //     fs: "empty"
    // },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        hot: true,
    },
};