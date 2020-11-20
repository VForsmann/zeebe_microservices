const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    resolve: {
        extensions: [".ts", ".js", ".tsx"],
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file-loader?name=app/images/[name].[ext]",
            }
        ],
    },
    plugins: [
        new CheckerPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
        }),
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        historyApiFallback: {
            index: "/",
        },
    },
};
