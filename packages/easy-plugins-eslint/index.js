const path = require('path')
const ejs = require('ejs')
const fs = require('fs-extra')
// module
module.exports = {
    configTemplate: (cfg, config) => {
        const dep = require('./package.json')
        cfg.addDevDependencies(dep.dependencies)
        cfg.addDevDependencies(dep.devDependencies)
        Promise.all(
            [
              ejs.renderFile(path.join(__dirname, './template/.eslintrc.js'), { 
                
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
        config.module.rules.delete('eslint')
        config.module.rule('eslint')
        .exclude.add(/(node_modules|bower_components)/).end()
        .include.add(path.resolve(__dirname,'../src')).end()
        .test(/\.js$/)
        .enforce('pre')
        .use('eslint-loader')
        .loader('eslint-loader')
        .options({
            formatter: require('eslint-friendly-formatter')
        }).end()
    }
}
