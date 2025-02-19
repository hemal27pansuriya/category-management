const removenull = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
}

const catchError = (name, error, req, res) => {
  handleCatchError(error)
  return res.status(status.InternalServerError).jsonp({
    status: jsonStatus.InternalServerError,
    message: messages[req.userLanguage].error
  })
}

const handleCatchError = (error) => {
  if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
  const { data = undefined, status = undefined } = error?.response ?? {}
  console.trace(error)
  if (error?.code === 'EAUTH' && error?.responseCode === 535) return console.log('**********ERROR***********', 'Username and Password not accepted')
  if (!status) console.log('**********ERROR***********', error)
  else console.log('**********ERROR***********', { status, data, error: data.errors })
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

module.exports = {
  removenull,
  catchError,
  handleCatchError,
  pick
}