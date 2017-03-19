'use strict'

import test from 'ava'
import execa from 'execa'

test('version', async t => {
  const {stdout} = await execa('./index.js', ['--version'])
  t.true(stdout.length > 0)
})

test('help', async t => {
  const {stdout} = await execa('./index.js', ['--help'])
  t.true(stdout.length > 300)
})

test('day', async t => {
  const {stdout} = await execa('./index.js')
  t.is(stdout, `Today isn't a Holiday 😔`)
})
