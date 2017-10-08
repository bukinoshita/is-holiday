'use strict'

import test from 'ava'
import execa from 'execa'

test('month', async t => {
  const { stdout } = await execa('./index.js', ['--month'])
  t.truthy(stdout)
})

test('year', async t => {
  const { stdout } = await execa('./index.js', ['--year'])
  t.truthy(stdout)
})

test('day', async t => {
  const { stdout } = await execa('./index.js')
  t.is(stdout, `> Today is not a Holiday 😔`)
})
