const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/App.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        sourceMapFilename: "[file].map"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.wasm$/,
                type: "asset/resource",
                generator: {
                    filename: "[name][ext]"
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            favicon: './public/favicon.ico',
        }),
    ],
    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true
    },
    resolve: {
        extensions: [".js", ".jsx", ".wasm"]
    },
    devServer: {
        static: "./public",
        port: 8080,
        open: false
    }
};
