'use strict'
const webpack = require('webpack')
const path = require('path')

module.exports = {
    configureWebpack: cfg => {
        cfg.addDependencies([
            {"react": "^16.11.0"},
            {"react-dom": "^16.11.0"},
            {"react-router-dom": "^5.1.2"}
        ])
        let config = cfg.config
        // devtool
        config.devtool('cheap-module-eval-source-map')
        
    }
}