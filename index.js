#!/usr/bin/env node
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')
const holiday = require('holiday')
const chalk = require('chalk')
const {getCountry, monthList} = require('./lib/countries')

const cli = meow(`
  Usage:
    $ is-holiday          Check if today is a holiday

  Example:
    $ is-holiday
    $ is-holiday --month
    $ is-holiday --year

  Options:
    -m, --month          Get every holiday for the current month
    -y, --year           Get every holiday for the current year

    -h, --help           Show help options
    -v, --version        Show version
`, {
  alias: {
    m: 'month',
    y: 'year',
    h: 'help',
    v: 'version'
  }
})

updateNotifier({pkg: cli.pkg}).notify()

const country = getCountry(cli.flags)
const run = () => {
  const tDate = new Date()
  const currentDay = tDate.getUTCDate()
  const currentMonth = tDate.getUTCMonth() + 1
  const currentYear = tDate.getUTCFullYear()

  if (cli.flags.h) {
    return cli.showHelp()
  }

  if (cli.flags.v) {
    return cli.pkg.version
  }

  holiday({country})
    .then(year => {
      const today = year[currentMonth][currentDay]
      const monthName = monthList[currentMonth - 1]

      if (cli.flags.y) {
        console.log(`${chalk.blue.bold(`Holidays in ${currentYear}`)} 🎊`)

        Object.keys(year).map(month => {
          console.log('\n')
          console.log(`${chalk.green(`${chalk.bold(`Holidays in ${monthList[month - 1]}`)}:\n----`)}`)
          return Object.keys(year[month]).map(day => console.log(`⇢ ${chalk.bold(day)}: ${year[month][day].title}`))
        })

        return
      }

      if (cli.flags.m && year[currentMonth]) {
        console.log(`${chalk.green(`${chalk.bold(`Holidays in ${monthName}`)}:\n----`)}`)
        Object.keys(year[currentMonth]).map(day => {
          return console.log(`⇢ ${chalk.bold(day)}: ${year[currentMonth][day].title}`)
        })
        return
      }

      if (cli.flags.m && !year[currentMonth]) {
        return console.log(`There're no Holidays this month 😔`)
      }

      if (!today) {
        return console.log(`Today isn't a Holiday 😔`)
      }

      console.log(`Today is ${today.title}! 🎊`)
    })
    .catch(err => err)
}

run(cli)
