#!/usr/bin/env node
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')
const holiday = require('holiday')
const { gray, bold } = require('chalk')
const spacetime = require('spacetime')
const shoutMessage = require('shout-message')

const rightPad = require('./lib/right-pad')

const cli = meow(
  `
  Usage:
    $ is-holiday          Check if today is a holiday

  Example:
    $ is-holiday
    $ is-holiday --month
    $ is-holiday --year

  Options:
    -m, --month           Get every holiday for the current month
    -y, --year            Get every holiday for the current year

    -h, --help            Show help options
    -v, --version         Show version
`,
  {
    alias: {
      m: 'month',
      y: 'year',
      h: 'help',
      v: 'version'
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

const run = async () => {
  const month = cli.flags.m
  const year = cli.flags.y
  let range = 'day'

  range = month ? 'month' : range
  range = year ? 'year' : range

  const isHoliday = await holiday({ range })

  if (year) {
    const months = Object.keys(isHoliday)

    return months.map(month => {
      const m = month.charAt(0).toUpperCase() + month.slice(1)
      const days = Object.keys(isHoliday[month])

      console.log(`${bold(m)}`)
      console.log(`${rightPad(gray('# Day'), 20)} ${gray('# Holiday')}`)

      days.map(day =>
        console.log(`${rightPad(day, 10)} ${isHoliday[month][day]}`)
      )

      return console.log('\r\n')
    })
  }

  if (month) {
    const today = spacetime.today()
    const s = new spacetime(today)
    const month = s.monthName()
    const m = month.charAt(0).toUpperCase() + month.slice(1)
    const days = Object.keys(isHoliday)

    console.log(`${bold(m)}`)
    console.log(`${rightPad(gray('# Day'), 20)} ${gray('# Holiday')}`)

    days.map(day => console.log(`${rightPad(day, 10)} ${isHoliday[day]}`))

    return console.log('\r\n')
  }

  const h =
    typeof isHoliday === 'undefined'
      ? `Today is not a Holiday 😔`
      : `Today is ${isHoliday}! 🎊`

  shoutMessage(h)
}

run()
