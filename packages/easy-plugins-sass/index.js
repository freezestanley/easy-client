const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
// less
module.exports = {
    configureWebpack: config => {
        config.module.rules.delete('sass')
        config.module.rule('sass')
            .test(/\.less$/)
       if (config.mode === 'application') {
            config.module.rule('sass')
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
            config.module.rule('sass')
                .use('style-loader')
                .loader('style-loader').end()
        }
        config.module.rule('sass').use('css')
            .loader('css-loader')
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({
                ident: 'postcss',
                plugins: (loader) => [
                require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                require('postcss-normalize')({ forceImport: true }),
                require('postcss-cssnext')({
                    features: {
                      customProperties: {
                        warnings: false
                      }
                    }
                  }),
                require('postcss-selector-namespace')({ selfSelector: ':namespace', namespace: `` })
                ]})
            .end()
            .use('sass')
            .loader('sass-loader')
            .end()
            .use('style-resources-loader')
            .loader('style-resources-loader')
            .options({
                patterns: [
                    path.resolve(__dirname, 'assets/variables/*.less'),
                    path.resolve(__dirname, 'assets/variables/*.scss'),
                ],
                injector: 'append'
            })
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