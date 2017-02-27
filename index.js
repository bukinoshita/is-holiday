#!/usr/bin/env node
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')
const holiday = require('holiday')
const chalk = require('chalk')

const cli = meow(`
  Usage:
    $ is-holiday          Check if today is a holiday

  Example:
    $ is-holiday
    $ is-holiday --br

  Options:
    --br, --brazil       Check if today is a holiday in Brazil
    -m, --month          Returns every holiday in current month
    -h, --help           Show help options
    -v, --version        Show version
`, {
  alias: {
    br: 'brazil',
    m: 'month',
    h: 'help',
    v: 'version'
  }
})

updateNotifier({pkg: cli.pkg}).notify()

const run = () => {
  const today = new Date()
  const day = !cli.flags.m ? today.getUTCDate() : undefined
  const month = today.getUTCMonth() + 1
  const country = cli.flags.br ? 'br' : 'us'
  const country_emoji = cli.flags.br ? '🇧🇷' : '🇺🇸'

  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  holiday(month, day, country)
    .then(res => {
      if (!res && cli.flags.m) {
        console.log(`There are no Holidays this month 😔 ${country_emoji}`)
      }

      if (!res) {
        console.log(`Today isn\'t a Holiday 😔 ${country_emoji}`)
      }

      if (res && cli.flags.m) {
        console.log(`${chalk.bold('Holidays in January')}:\n----`)
        Object.keys(res).map(day => console.log(`⇢ ${chalk.bold(day)}: ${res[day].title}`))
        return
      }

      console.log(`Today is ${res.title}! 🎊 ${country_emoji}`)

    })
    .catch(err => console.log(`Ops, something went wrong... ${err}`))
}

run(cli)
