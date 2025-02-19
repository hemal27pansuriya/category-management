const router = require('express').Router()
const { validate } = require('../../../middlewares/middleware')
const services = require('./services')
const validators = require('./validators')

router.post('/auth/register', validators.register, validate, services.register)
router.post('/auth/login', validators.login, validate, services.login)

module.exports = router
