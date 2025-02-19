const { status, jsonStatus, messages } = require('../helper/api.responses')

module.exports = (app) => {
  app.use('/api', [
  ])


  app.get('*', (req, res) => {
    return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', 'route') })
  })
}
