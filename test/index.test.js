/* global describe, it, beforeEach */
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const assert = require('assert')

let sendSpy = sinon.spy()

const wsMock = {
  on: function () {

  },
  send: sendSpy
}

let stdinCb

const stdinStub = {
  addListener: function (data, fn) {
    stdinCb = fn
  }
}

process.openStdin = function () {
  return stdinStub
}

const wsStub = {
  Server: function () {
    return {
      on: function (event, callback) {
        callback(wsMock, { url: '/api/v1/' })
      }
    }
  }
}
const dbStub = {
  api: {
    v1: {
      key1: {
        a: 'b',
        c: 'd'
      },
      key2: 5,
      key3: [1, 2]
    }
  }
}

const dbStubArray = {
  api: {
    v1: [1, 2]
  }
}

const WSS = proxyquire('../src/index', { ws: wsStub, '../db': dbStub })

describe('WSS', function () {
  let wss
  beforeEach(function () {
    wss = new WSS('../db', 8080)
    sendSpy.resetHistory()
  })

  it('should send the right data on connection', function () {
    assert(!sendSpy.calledOnce)
    wss.run()
    assert(sendSpy.calledOnce)
    assert.strictEqual(sendSpy.getCall(0).args[0], JSON.stringify(dbStub.api.v1))
  })

  it('should merge data from stdin', function () {
    assert(!sendSpy.calledOnce)
    stdinCb(
      {
        toString: function () {
          return 'merge {"key4": "baz"}'
        }
      }
    )
    assert(sendSpy.calledOnce)
    assert.strictEqual(sendSpy.getCall(0).args[0], JSON.stringify(Object.assign({}, dbStub.api.v1, { key4: 'baz' })))
  })

  it('should deepmerge data from stdin', function () {
    assert(!sendSpy.calledOnce)
    stdinCb(
      {
        toString: function () {
          return 'deepmerge {"key1": {"e": "f"}}'
        }
      }
    )
    assert(sendSpy.calledOnce)
    let res = Object.assign({}, dbStub.api.v1.key1)
    res['e'] = 'f'
    assert.strictEqual(sendSpy.getCall(0).args[0], JSON.stringify(Object.assign({}, dbStub.api.v1, { key1: res })))
  })

  it('should send new data from stdin', function () {
    assert(!sendSpy.calledOnce)
    stdinCb(
      {
        toString: function () {
          return '{"foo": "bar"}'
        }
      }
    )
    assert(sendSpy.calledOnce)
    assert.strictEqual(sendSpy.getCall(0).args[0], JSON.stringify({ foo: 'bar' }))
  })
})
