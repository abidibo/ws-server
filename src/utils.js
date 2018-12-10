const isArray = function (a) {
  return (!!a) && (a.constructor === Array)
}

module.exports.isArray = isArray

const isObject = function (a) {
  return (!!a) && (a.constructor === Object)
}

module.exports.isObject = isObject
