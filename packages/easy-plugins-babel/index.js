const path = require('path')
const ejs = require('ejs')
const fs = require('fs-extra')
// module
module.exports = {
    configTemplate: (dir) => {
        Promise.all(
            [
              ejs.renderFile(path.join(__dirname, './template/.eslintrc.js'), { 
                plugin: ['less', 'sass', 'babel', 'images'],// answers.select,
              })
            ]
          ).then((res) => {
            fs.writeFileSync(
                `${process.cwd()}/.eslintrc.js`,
                res[0]
            )
          })
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
        .use('eslint-loader')
        .loader('eslint-loader')
        .options({
            formatter: require('eslint-friendly-formatter')
        }).end()
    }
}
