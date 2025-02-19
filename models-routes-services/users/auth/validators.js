const { body } = require('express-validator')

const register = [
  body('sUsername').not().isEmpty().isString(),
  body('sMobNum').not().isEmpty(),
  body('sEmail').not().isEmpty().isEmail().toLowerCase(),
  body('sPassword').not().isEmpty().isString()
]

const login = [
  body('sUsername').not().isEmpty().isString(),
  body('sPassword').not().isEmpty().isString()
]

module.exports = {
  register,
  login
}
