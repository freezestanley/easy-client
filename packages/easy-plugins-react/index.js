'use strict'
const path = require('path')
const dir = require('./utils/dir')

module.exports = {
    configTemplate: (cfg, config) => {
        const dep = require('./package.json')
        cfg.addDevDependencies([dep.dependencies, 
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
        dir.copyFolder('./template/', process.cwd())
    },
    configureWebpack: cfg => {
        let config = cfg.config
        // devtool
        config.devtool('cheap-module-eval-source-map')
        config
            .entry('index')
                .add('./src/index.js')
                .end()
            .output
                .path(path.resolve(__dirname, '../dist'))
                .filename('[name].[hash:8].js')
                // .publicPath()
                .library('other')
                .libraryTarget('umd')

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
    }
}