#!/usr/bin/env node 
const command = require('commander')
const program = new command.Command()
const chalk = require('chalk')
const execa = require('execa')
const path = require('path')
const fs = require('fs')
const utils = require('../lib')

program
  .version('1.0.1')

// 获取 help
program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ custom-help --help')
  console.log('  $ custom-help -h')
})

program
  .command('serve')
  .description('启动开发服务')
  .action((e) => {
    // const child = spawn('cross-env', ['webpack-dev-server', '--hot', '--inline', '--colors', '--config', 'build/webpack.dev.conf.js'], { stdio: 'inherit' })
    // const child = spawn('node', [path.resolve(__dirname, '../build/webpack.dev.conf.js')], { stdio: 'inherit' })
  })

program
  .command('build')
  .description('构建生产版本')
  .action((e) => {
    // const child = spawn('cross-env', ['NODE_ENV=production', 'webpack', '--progress', '--colors', '--config', 'build/webpack.product.conf.js'], { stdio: 'inherit' })
    // const child = spawn('node', [path.resolve(__dirname, '../build/webpack.product.conf.js')], { stdio: 'inherit' })
  })

program
  .command('lint')
  .description('静态扫描')
  .action((e) => {
    // const child = spawn('eslint', ['--ext', '.jsx,.js', 'src', '-f', 'checkstyle', '-o', 'report_zacc_eslint_js.xml;', 'exit', '0'], { stdio: 'inherit' })
  })

program
  .command('init')
  .description('静态扫描')
  .action((e) => {
    const result = utils.readerZarc()
  })

program.parse(process.argv)