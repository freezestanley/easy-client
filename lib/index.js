'use strict'
const Config = require('webpack-chain')
const path = require('path')
const cwd = process.cwd()
const execa = require('execa')
const merge = require('webpack-merge')
const fs = require('fs-extra')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

function depConfig () {
    this.config = new Config()
    this.addDependencies = function (obj) {
        if (!obj) return
        const pk = require(`${process.cwd()}/package.json`)
        if (Array.isArray(obj)) {
            obj.map((ele) => {
                pk.dependencies = Object.assign(pk.dependencies, ele)
            })
        } else {
            pk.dependencies = Object.assign(pk.dependencies, obj)
        }
        fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pk))
    }
    this.addDevDependencies = function (obj) {
        if (!obj) return
        let pk = require(`${process.cwd()}/package.json`)
        if (Array.isArray(obj)) {
            obj.map((ele) => {
                pk.devDependencies = Object.assign(pk.devDependencies, ele)
            })
        } else {
            pk.devDependencies = Object.assign(pk.devDependencies, obj)
        }
        fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pk))
    }
}

module.exports = {
    readerZarc: function readerZarc (isinit) {
        const result = require(`${process.cwd()}/.easyrc.js`) // 本地配置修改
        const cfg = new depConfig()
        result.perset.map((plugins)=>{
            const ele = require(`easy-plugins-${plugins}`)
            if (isinit) {
                ele.configTemplate ? ele.configTemplate(cfg, result) : null
            } else {
                ele.configureWebpack? ele.configureWebpack(cfg, result) : null
            }
        })
        if (!isinit) {
            result.configureWebpack(cfg, result)
        

            const options = {
                contentBase: path.resolve(process.cwd(), './dist'),
                hot: true,
                host: 'localhost',
                historyApiFallback: true,
                compress: true
              }
            const resultConfig = merge({}, cfg.config.toConfig())
            console.log(cfg.config.toString())
            
                webpackDevServer.addDevServerEntrypoints(resultConfig, options)
                const compiler = webpack(resultConfig)
                const server = new webpackDevServer(compiler, options)
                server.listen(5000, 'localhost', () => {
                    console.log('dev server listening on port 5000');
                })
        }  
    }
}