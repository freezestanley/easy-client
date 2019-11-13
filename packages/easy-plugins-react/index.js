'use strict'
const path = require('path')
const dir = require('./utils/dir')
module.exports = {
    configTemplate: (cfg, config) => {
        const dep = require('./package.json')
        cfg.addDevDependencies([
            dep.dependencies, 
            dep.devDependencies, 
            {
                "html-webpack-plugin": "^3.2.0",
                "prettier": "^1.19.1"
            }
        ])
        cfg.addDependencies([
            {"react": "^16.11.0"},
            {"react-dom": "^16.11.0"},
            {"react-router-dom": "^5.1.2"}
        ])
        dir.copyFolder(`${__dirname}/template/`, process.cwd())
    },
    configureWebpack: cfg => {
        const webpack = require('webpack')
        const { CleanWebpackPlugin } = require('clean-webpack-plugin')
        const CompressionPlugin = require('compression-webpack-plugin')
        const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        const MiniCssExtractPlugin = require("mini-css-extract-plugin")
        const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
        const safePostCssParser = require('postcss-safe-parser')
        const HtmlWebpackPlugin = require('html-webpack-plugin')
        const PurifyCSS = require('purifycss-webpack')
        const PreloadWebpackPlugin = require('preload-webpack-plugin')
        const TerserPlugin = require('terser-webpack-plugin')
        const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
        const glob = require('glob-all')

        let config = cfg.config

        config
            .entry('index')
                .add(path.resolve(process.cwd(), './src/index.js'))
                .end()
            .output
                .path(path.resolve(process.cwd(), './dist'))
                .filename('[name].[hash:8].js')
                // .publicPath()
                .library('other')
                .libraryTarget('umd')


        // devtool
        if (process.env.NODE_ENV === 'development') {
            config.devtool('cheap-module-eval-source-map')
            config.mode('development')

            // plugin
            config.plugin('htmlwebpackplugin')
            .use(require('html-webpack-plugin'), [
            Object.assign(
                {},
                {
                    inject: true,
                    template: path.resolve(process.cwd(), './index.html')
                }
            )
            ]).end()
            .plugin('HotModuleReplacementPlugin')
            .use(require('webpack').HotModuleReplacementPlugin).end()
            
        } else {
            config.devtool('source-map')
            config.mode('production')
            // plugin
            config  
                .plugin('progress')
                .use(webpack.ProgressPlugin).end()
                .plugin('IgnorePlugin')
                .use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]).end()
                .plugin('htmlwebpackplugin')
                .use(HtmlWebpackPlugin, [
                    Object.assign(
                    {},
                    {
                        inject: true,
                        template: path.resolve(process.cwd(), './index.html')
                    },
                    {
                        minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                        }
                    }
                    )
                ]).end()
                .plugin('PreloadWebpackPlugin')
                .use(PreloadWebpackPlugin, [{
                    rel: 'preload',
                    as: 'script'
                }]).end()
                .plugin('ScriptExtHtmlWebpackPlugin')
                .use(ScriptExtHtmlWebpackPlugin, [{
                    preload: /\.js$/,
                    defaultAttribute: 'defer'
                }]).end()
                .plugin('HardSourceWebpackPlugin')
                .use(HardSourceWebpackPlugin).end()
                .plugin('ModuleConcatenationPlugin')
                .use(webpack.optimize.ModuleConcatenationPlugin).end()
                .plugin('HashedModule')
                .use(webpack.HashedModuleIdsPlugin).end()
                .plugin('Compression')
                .use(CompressionPlugin, [{
                    algorithm: 'gzip',
                    threshold: 10240,
                    minRatio: 0.7
                }]).end()
                .plugin('PurifyCSS')
                .use(PurifyCSS, [{
                    paths: glob.sync([
                    path.resolve(process.cwd(), './src/*.js')
                    ])
                }]).end()
                // .plugin('MiniCssExtractPlugin')
                // .use(MiniCssExtractPlugin, [{
                //     filename: "[name].[contenthash:8].css",
                //     chunkFilename: "[name].[contenthash:8].css"
                // }]).end()
                // .plugin('OptimizeCssAssetsPlugin')
                // .use(OptimizeCssAssetsPlugin, [{ 
                //     cssProcessorOptions: { 
                //     parser: safePostCssParser
                //     } }]).end()
                .plugin('NamedModulesPlugin')
                .use(webpack.NamedModulesPlugin).end()
                .plugin('clean')
                .use(CleanWebpackPlugin).end()
                .plugin('BundleAnalyzerPlugin')
                .use(BundleAnalyzerPlugin)
                .end()



                config.optimization
                    .minimize(true)
                    .minimizer('OptimizeCssAssetsPlugin')
                    .use(OptimizeCssAssetsPlugin, [{ cssProcessorOptions: { safe: true } }])
                    .end()
                    .minimizer('TerserPlugin')
                    .use(TerserPlugin)
                    .end()
                    .namedChunks(true)
                    .runtimeChunk({name: 'runtime'})
                    .splitChunks({
                    minSize: 3000,
                    minChunks: 1,
                    maxAsyncRequests: 5,
                    maxInitialRequests: 3,
                    name: false,
                    cacheGroups: {
                        vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial',
                        reuseExistingChunk: true
                        }
                    }
                    })
                    .removeEmptyChunks(true)

        }
    }
}