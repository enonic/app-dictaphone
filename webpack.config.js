const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

const paths = {
    assets: 'src/main/resources/assets/',
    buildAssets: 'build/resources/main/assets/',
    buildPwaLib: 'build/resources/main/lib/pwa/'
};

const assetsPath = path.join(__dirname, paths.assets);
const buildAssetsPath = path.join(__dirname, paths.buildAssets);
const buildPwaLibPath = path.join(__dirname, paths.buildPwaLib);

module.exports = {

    entry: path.join(assetsPath, 'js/main.js'),

    output: {
        path: buildAssetsPath,

        filename: 'precache/bundle.js'
    },

    resolve: {
        extensions: ['.js', '.less']
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.svg$/,
                loader: 'file-loader?name=icons/[name].[ext]'
            },
            {
                test: /\.woff$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader?name=icons/[name].[ext]'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'precache/bundle.css'
        }),
        new workboxPlugin.InjectManifest({
            globDirectory: buildAssetsPath,
            globPatterns: ['precache/**\/*'],
            globIgnores: [],
            swSrc: path.join(assetsPath, 'js/sw-dev.js'),
            swDest: path.join(buildPwaLibPath, 'sw-template.js')
        })
    ],

    mode: 'production'

};