const path = require('path')
// less
module.exports = {
    configureWebpack: config => {
        config.module.rules.delete('less')
        config.module.rule('less')
            .test(/\.less$/)
       if (config.mode === 'application') {
            config.module.rule('less')
                .use('mini')
                .loader(require("mini-css-extract-plugin").loader).options({
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
            .use('less')
            .loader('less-loader')
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
            .use(require("mini-css-extract-plugin"), [{
                filename: "[name].[contenthash:8].css",
                chunkFilename: "[name].[contenthash:8].css"
            }]).end()
        .plugin('OptimizeCssAssetsPlugin')
            .use(require('optimize-css-assets-webpack-plugin'), [{ 
                cssProcessorOptions: { 
                parser: require('postcss-safe-parser')
            }}]).end()


        console.log('========')
        console.log(config.toString())
        console.log('========')
    }
}