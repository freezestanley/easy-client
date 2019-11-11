'use strict'
const Config = require('webpack-chain')
const path = require('path')
const webpack = require('webpack')
const cwd = process.cwd()
const execa = require('execa')
const merge = require('webpack-merge')
const fs = require('fs-extra')

function depConfig () {
    this.config = new Config()
    this.addDependencies = function (obj) {
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
    readerZarc: function readerZarc () {
        const result = require(`${process.cwd()}/.zarc.js`) // 本地配置修改
        const cfg = new depConfig()
        result.perset.map((plugins)=>{
            const ele = require(`easy-plugins-${plugins}`)
            ele.configureWebpack(cfg, result)
            ele.configTemplate ? ele.configTemplate(result) : null
        })

        result.configureWebpack(cfg, result)
        const options = {
            contentBase: path.resolve(process.cwd(), './dist'),
            hot: true,
            host: 'localhost',
            historyApiFallback: true,
            compress: true
          }
        const result = merge({}, cfg.config.toConfig())
        console.log(cfg.config.toString())
        webpackDevServer.addDevServerEntrypoints(result, options)
        const compiler = webpack(result)
        const server = new webpackDevServer(compiler, options)
        server.listen(5000, 'localhost', () => {
            console.log('dev server listening on port 5000');
        })
    }
}