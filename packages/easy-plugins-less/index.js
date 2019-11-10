const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')

module.exports = {
    configureWebpack: config => {
        config.module.rules.delete('less')
        config.module.rule('less')
            .test(/\.less$/)
       if (config.mode === 'application') {
            config.module.rule('less')
                .use('mini')
                .loader(MiniCssExtractPlugin.loader).options({
                hmr: process.env.NODE_ENV === 'development',
                fallback: {
                    loader: require.resolve('style-loader'),
                    options: {
                        singleton: true
                    }
                }
                }).end()
        
        } else {
            config.module.rule('less')
                .use('style-loader')
                .loader('style-loader').end()
        }
        config.module.rule('less').use('css')
            .loader('css-loader')
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({
                ident: 'postcss',
                plugins: (loader) => [
                require('postcss-preset-env')(),
                require('postcss-normalize')({ forceImport: true }),
                require('postcss-cssnext')(),
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-selector-namespace')({ selfSelector: ':namespace', namespace: `` })
                ]})
            .end()
            .use('less')
            .loader('less-loader')
            .end()

        config.plugin('MiniCssExtractPlugin')
            .use(MiniCssExtractPlugin, [{
                filename: "[name].[contenthash:8].css",
                chunkFilename: "[name].[contenthash:8].css"
            }]).end()
        .plugin('OptimizeCssAssetsPlugin')
            .use(OptimizeCssAssetsPlugin, [{ 
                cssProcessorOptions: { 
                parser: safePostCssParser
            }}]).end()


        console.log('========')
        console.log(config.toString())
        console.log('========')
    }
}