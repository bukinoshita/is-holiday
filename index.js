#!/usr/bin/env node
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')
const holiday = require('holiday')

const cli = meow(`
  Usage:
    $ is-holiday          Check if today is a holiday

  Example:
    $ is-holiday
    $ is-holiday --br

  Options:
    --br, --brazil       Check if today is a holiday in Brazil
    -h, --help           Show help options
    -v, --version        Show version
`, {
  alias: {
    br: 'brazil',
    h: 'help',
    v: 'version'
  }
})

updateNotifier({pkg: cli.pkg}).notify()

const run = () => {
  const today = new Date()
  const day = today.getUTCDate()
  const month = today.getUTCMonth() + 1

  if (cli.flags.help) {
    cli.showHelp()
  } else if (cli.flags.br) {
    holiday(month, day, 'br')
      .then(res => {
        if (res) {
          console.log(`Today is ${res.title}! 🎊 🇧🇷`)

          return false
        }

        console.log('Today isn\'t a Holiday 😔 🇧🇷')
      })
      .catch(err => console.log(`Ops, something went wrong... ${err}`))
  } else {
    holiday(month, day)
      .then(res => {
        if (res) {
          console.log(`Today is ${res.title}! 🎊 🇺🇸`)

          return false
        }

        console.log('Today isn\'t a Holiday 😔 🇺🇸')
      })
      .catch(err => console.log(`Ops, something went wrong... ${err}`))
  }
}

run(cli)
