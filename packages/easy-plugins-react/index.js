'use strict'
const webpack = require('webpack')
const path = require('path')

module.exports = {
    configTemplate: (cfg, config) => {
        const dep = require('./package.json')
        cfg.addDevDependencies(dep.dependencies)
        cfg.addDevDependencies({"html-webpack-plugin": "^3.2.0"})
        cfg.addDependencies([
            {"react": "^16.11.0"},
            {"react-dom": "^16.11.0"},
            {"react-router-dom": "^5.1.2"}
        ])
    },
    configureWebpack: cfg => {
        let config = cfg.config
        // devtool
        config.devtool('cheap-module-eval-source-map')
        
    }
}