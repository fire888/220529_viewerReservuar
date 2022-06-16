const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')

module.exports = (env, { mode }) => {
    return {
        entry: './src/index.js',
        devtool: mode === 'development' ? 'source-map' : undefined,
        devServer: {
            host: '192.168.0.101',
            port: 9000,
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: "public/draco", to: "draco" }
                ]
            }),
            new MiniCssExtractPlugin(),
            // new webpack.DefinePlugin({
            //     'BACKEND_HOST': JSON.stringify('' + BACKEND_HOST),
            // }),
        ],
        module: {
            rules: [
                // {
                //     test: /\.(jsx|js)$/,
                //     include: path.resolve(__dirname, 'src'),
                //     exclude: /node_modules/,
                //     use: [
                //         {
                //             loader: 'babel-loader',
                //             options: {
                //                 presets: [
                //                     [
                //                         '@babel/preset-env',
                //                         {   "targets": "defaults" }
                //                     ],
                //                     '@babel/preset-react'
                //                 ]
                //             }
                //         }
                //     ]
                // },
                {
                    test: /\.(gltf|bin|fbx)$/,
                    exclude: /node_modules/,
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                    },
                },

                {
                    test: /\.(png|jpg)$/,
                    exclude: /node_modules/,
                    loader: "file-loader",
                    options: {
                        name: 'txtrs/[name].[ext]',
                    },
                },



                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: "babel-loader"
                },

                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
    }
}
