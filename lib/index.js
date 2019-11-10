'use strict'
const Config = require('webpack-chain')
const path = require('path')
const webpack = require('webpack')
const cwd = process.cwd()
const execa = require('execa')
const merge = require('webpack-merge')

module.exports = {
    readerZarc: function readerZarc () {
        const result = require(`${process.cwd()}/.zarc.js`) // 本地配置修改
        const config = new Config()
        result.perset.map((plugins)=>{
            const ele = require(`easy-plugins-${plugins}`)
            ele.configureWebpack(config)
        })

        result.configureWebpack(config)
        const compiler = webpack(merge({}, config.toConfig()));
        compiler.run((err, stats) => {
            console.log('Successful')
        })
        console.log(config.toString())
    }
}