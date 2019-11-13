module.exports = {
    configTemplate: (cfg, config) => {
        const dep = require('./package.json')
        cfg.addDevDependencies([dep.dependencies, dep.devDependencies])
    },
    configureWebpack: cfg => {
        let config = cfg.config
        config.module.rule('images')
        .test(/\.(png|jpg|gif)$/i)
        .use('urlloader')
        .loader('url-loader').options({
            limit: 8192,
            quality: 85,
            name: '../dist/images/[name].[hash:8].[ext]',
        }).end()
    }
}