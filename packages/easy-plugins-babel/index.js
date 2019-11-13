const path = require('path')
// module
module.exports = {
    configTemplate: (cfg, config) => {
        const dep = require('./package.json')
        cfg.addDevDependencies(dep.dependencies)
        cfg.addDevDependencies(dep.devDependencies)
    },
    configureWebpack: cfg => {
        let config = cfg.config
        config.module.rules.delete('babel')
        config.module.rule('babel')
        .exclude.add(/(node_modules|bower_components)/)
        .end()
        .include.add(path.resolve(process.cwd(), './src')).end()
        .test(/\.js|jsx|mjs$/)
        .use('babel')
        .loader('babel-loader').options({
            "presets": ["@babel/preset-env", "@babel/preset-react"],
            "plugins": [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-transform-react-jsx-self"
            ]
        }).end()
    }
}
