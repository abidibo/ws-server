let WsException = {
  toString: function () {
    return `${this.name}: ${this.message}`
  }
}

function InvalidFileException (message) {
  this.message = message
  this.name = 'InvalidFileException'
}

InvalidFileException.prototype = WsException

module.exports.InvalidFileException = InvalidFileException
