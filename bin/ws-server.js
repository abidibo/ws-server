const path = require('path')
const fs = require('fs')
const ArgumentParser = require('argparse').ArgumentParser
const WSS = require('../src/index.js')
const exceptions = require('../src/exceptions')

// cli options and flags
var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp: true,
  description: 'ws-server cli'
})

// input validation: abs path or path relative to cwd
const fileType = function (filePath) {
  const cwd = process.cwd()
  let absPath = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath)
  if (fs.existsSync(absPath)) {
    return absPath
  } else {
    throw new exceptions.InvalidFileException('Invalid file path')
  }
}

parser.addArgument(
  [ '-p', '--port' ],
  {
    help: 'Websocket server port',
    defaultValue: 9704,
    type: 'int',
    dest: 'port'
  }
)
parser.addArgument(
  [ '-i', '--input' ],
  {
    help: 'JSON or js input file which exports (es5) an object',
    required: true,
    dest: 'db',
    type: fileType
  }
)
var args = parser.parseArgs()

var wss = new WSS(args.db, args.port)
wss.run()
