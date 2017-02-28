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
    -m, --month          Get every holiday for the current month
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

const countries = ['br', 'us']

const getCountry = flags => {
  const country = countries.filter(c => flags[c])
  return country[0] || 'us'
}

const run = () => {
  const today = new Date()
  const day = cli.flags.m === undefined || cli.flags.m === false ? today.getUTCDate() : undefined
  const month = today.getUTCMonth() + 1
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const country = getCountry(cli.flags)
  const countryEmoji = {
    br: '🇧🇷',
    us: '🇺🇸'
  }[country]

  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  holiday(month, day, country)
    .then(res => {
      if (!res && cli.flags.m) {
        console.log(`There are no Holidays this month 😔 ${countryEmoji}`)
      }

      if (res && cli.flags.m) {
        console.log(`${chalk.bold('Holidays in ' + monthNames[month - 1])}:\n----`)
        Object.keys(res).map(day => console.log(`⇢ ${chalk.bold(day)}: ${res[day].title}`))
        return
      }

      if (!res) {
        console.log(`Today isn't a Holiday 😔 ${countryEmoji}`)
        return false
      }

      console.log(`Today is ${res.title}! 🎊 ${countryEmoji}`)
    })
    .catch(err => console.log(`Ops, something went wrong... ${err}`))
}

run(cli)
