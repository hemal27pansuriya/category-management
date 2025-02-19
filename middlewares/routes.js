module.exports = (app) => {
  app.use('/api', [
    require('../models-routes-services/users/auth/routes'),
    require('../models-routes-services/category/routes')
  ])

  app.get('*', (req, res) => {
    return res.status(404).jsonp({ status: 404, message: 'Route Not Found' })
  })
}
