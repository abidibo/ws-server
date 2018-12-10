/* global describe, it */
const stdinParse = require('../src/stdin').stdinParse
const assert = require('assert')

const Input = function (text) {
  this.toString = function () {
    return text
  }
}

describe('stdinParse', function () {
  it('should detect merge feature and compose data correctly', function () {
    assert.deepStrictEqual(stdinParse(new Input('merge {"foo": "bar"}')), { merge: true, obj: { foo: 'bar' } })
  })
  it('should detect deepmerge feature and compose data correctly', function () {
    assert.deepStrictEqual(stdinParse(new Input('deepmerge {"foo": "bar"}')), { deepmerge: true, obj: { foo: 'bar' } })
  })
  it('should detect append feature and compose data correctly', function () {
    assert.deepStrictEqual(stdinParse(new Input('append [1, 2, 3]')), { append: true, arr: [1, 2, 3] })
  })
  it('should detect json formatted data and compose data correctly', function () {
    assert.deepStrictEqual(stdinParse(new Input('{"foo": "bar"}')), { data: { foo: 'bar' } })
  })
  it('should return undefined if not json formatted data', function () {
    assert.strictEqual(stdinParse(new Input('{"foo": "bar"')), undefined)
  })
})
