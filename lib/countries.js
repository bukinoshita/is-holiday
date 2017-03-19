'use strict'

const countries = ['us']

const getCountry = flags => {
  const country = countries.filter(c => flags[c])
  return country[0] || 'us'
}

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

exports.getCountry = getCountry
exports.monthList = monthList
