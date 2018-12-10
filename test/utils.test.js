/* global describe, it */
const utils = require('../src/utils')
const assert = require('assert')

describe('isArray function', function () {
  it('should detect an array', function () {
    assert.strictEqual(utils.isArray([1, 2, 3]), true)
    assert.strictEqual(utils.isArray(['mao']), true)
    assert.strictEqual(utils.isArray(new Array(1, 3)), true)
  })

  it('should detect a non array', function () {
    assert.strictEqual(utils.isArray(), false)
    assert.strictEqual(utils.isArray(null), false)
    assert.strictEqual(utils.isArray('bar'), false)
  })
})

describe('isObject function', function () {
  it('should detect an object', function () {
    assert.strictEqual(utils.isObject({ key: 'value' }), true)
  })

  it('should detect a non object', function () {
    assert.strictEqual(utils.isObject(), false)
    assert.strictEqual(utils.isObject(null), false)
    assert.strictEqual(utils.isObject([]), false)
  })
})
