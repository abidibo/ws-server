const WebSocket = require('ws')
const term = require('terminal-kit').terminal
const merge = require('deepmerge')
const utils = require('./utils')
const stdinParse = require('./stdin').stdinParse

function WSS (db, port) {
  this.run = function () {
    // start server
    const wss = new WebSocket.Server({ port: port })
    term.brightRed(`
     █     █░  ██████   ██████ ▓█████  ██▀███   ██▒   █▓▓█████  ██▀███  
    ▓█░ █ ░█░▒██    ▒ ▒██    ▒ ▓█   ▀ ▓██ ▒ ██▒▓██░   █▒▓█   ▀ ▓██ ▒ ██▒
    ▒█░ █ ░█ ░ ▓██▄   ░ ▓██▄   ▒███   ▓██ ░▄█ ▒ ▓██  █▒░▒███   ▓██ ░▄█ ▒
    ░█░ █ ░█   ▒   ██▒  ▒   ██▒▒▓█  ▄ ▒██▀▀█▄    ▒██ █░░▒▓█  ▄ ▒██▀▀█▄  
    ░░██▒██▓ ▒██████▒▒▒██████▒▒░▒████▒░██▓ ▒██▒   ▒▀█░  ░▒████▒░██▓ ▒██▒
    ░ ▓░▒ ▒  ▒ ▒▓▒ ▒ ░▒ ▒▓▒ ▒ ░░░ ▒░ ░░ ▒▓ ░▒▓░   ░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░
      ▒ ░ ░  ░ ░▒  ░ ░░ ░▒  ░ ░ ░ ░  ░  ░▒ ░ ▒░   ░ ░░   ░ ░  ░  ░▒ ░ ▒░
      ░   ░  ░  ░  ░  ░  ░  ░     ░     ░░   ░      ░░     ░     ░░   ░ 
        ░          ░        ░     ░  ░   ░           ░     ░  ░   ░     
    `)
    console.log(`\nListening on localhost:${port}`)

    // send data through socket
    let sendData = function (ws, req, data) {
      let res
      // stdin input data
      if (data && !data.merge && !data.deepmerge && !data.append) {
        res = data.data
      } else {
        // clear cache, require should always run again to detect file changes
        // or random stuff
        delete require.cache[require.resolve(db)]
        res = require(db)
        // input file response
        req.url.split('/').forEach(p => { if (p) { res = res[p] } })
        if (data && data.merge && utils.isObject(res) && utils.isObject(data.obj)) {
          // merge stdin object input
          res = Object.assign({}, res, data.obj)
        } else if (data && data.deepmerge && utils.isObject(res) && utils.isObject(data.obj)) {
          // deepmerge stdin object input
          res = merge(res, data.obj)
        } else if (data && data.append && utils.isArray(res) && utils.isArray(data.arr)) {
          // or concat stdin array input
          res = res.concat(data.arr)
        }
      }

      console.log('\n\nSending:\n')
      term.green(JSON.stringify(res, 4, 2))
      console.log('\n\nPress Enter to send data again')
      console.log('Digit "merge <obj>" and press Enter to send data merged with obj (json valid)')
      console.log('Digit "deepmerge <obj>" and press Enter to send data deep-merged with obj (json valid)')
      console.log('Digit "append <arr>" and press Enter to send data concat with arr (json valid)')
      ws.send(JSON.stringify(res))
    }

    wss.on('connection', function connection (ws, req) {
      term.brightCyan('\nNew connection: ', req.url)
      ws.on('message', function incoming (message) {
        console.log('received: %s', message)
      })

      // send data on connection
      sendData(ws, req)

      // read from stdin
      var stdin = process.openStdin()
      stdin.addListener('data', function (d) {
        let data = stdinParse(d)
        sendData(ws, req, data)
      })
    })
  }
}

module.exports = WSS
