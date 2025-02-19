const catchError = (name, error, req, res) => {
  handleCatchError(error)
  return res.status(500).jsonp({
    status: 500,
    message: 'Something went wrong'
  })
}

const handleCatchError = (error) => {
  const { data = undefined, status = undefined } = error?.response ?? {}
  console.trace(error)
  if (error?.code === 'EAUTH' && error?.responseCode === 535) return console.log('**********ERROR***********', 'Username and Password not accepted')
  if (!status) console.log('**********ERROR***********', error)
  else console.log('**********ERROR***********', { status, data, error: data.errors })
}

module.exports = {
  catchError,
  handleCatchError
}
