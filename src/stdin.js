const term = require('terminal-kit').terminal

function stdinParse (d) {
  let input = d.toString().trim()
  let data
  try {
    if (/^merge /.test(input)) {
      // object to merge
      data = {
        merge: true,
        obj: JSON.parse(input.replace(/^merge /, ''))
      }
    } else if (/^deepmerge /.test(input)) {
      // object to merge
      data = {
        deepmerge: true,
        obj: JSON.parse(input.replace(/^deepmerge /, ''))
      }
    } else if (/^append /.test(input)) {
      // array to append
      data = {
        append: true,
        arr: JSON.parse(input.replace(/^append /, ''))
      }
    } else if (input) {
      // new data to send
      data = {
        data: JSON.parse(input)
      }
    }
  } catch (e) {
    term.error.red(`${e}. Sending original data.`)
  }
  return data
}

module.exports.stdinParse = stdinParse
