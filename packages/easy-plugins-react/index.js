'use strict'
const webpack = require('webpack')
const path = require('path')

module.exports = {
    configureWebpack: cfg => {
        let config = cfg.config
        // devtool
        config.devtool('cheap-module-eval-source-map')
        
    }
}