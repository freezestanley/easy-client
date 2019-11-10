const path = require('path')
// module
module.exports = {
    configureWebpack: config => {
        config.module.rule('compile')
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
        .use('eslint-loader')
        .loader('eslint-loader')
        .options({
            formatter: require('eslint-friendly-formatter')
        }).end()
    }
}
