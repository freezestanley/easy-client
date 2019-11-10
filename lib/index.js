'use strict'
const Config = require('webpack-chain')
const path = require('path')
const webpack = require('webpack')
const cwd = process.cwd()
const execa = require('execa')
const merge = require('webpack-merge')
function depConfig () {
    this.config = new Config()
}

module.exports = {
    readerZarc: function readerZarc () {
        const result = require(`${process.cwd()}/.zarc.js`) // 本地配置修改
        const cfg = new depConfig()
        result.perset.map((plugins)=>{
            const ele = require(`easy-plugins-${plugins}`)
            ele.configureWebpack(cfg)
        })

        result.configureWebpack(cfg)
        const compiler = webpack(merge({}, cfg.config.toConfig()));
        compiler.run((err, stats) => {
            console.log('Successful')
        })
        console.log(cfg.config.toString())
    }
}