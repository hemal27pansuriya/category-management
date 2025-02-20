const { validationResult } = require('express-validator')
const { catchError } = require('../helper/utilities.services')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_USER } = require('../config/defaultConfig')
const UsersModel = require('../models-routes-services/users/auth/model')

const validate = function (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsonp({ status: 422, errors: errors.array() })
  }
  next()
}

const isUserAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(401).jsonp({
        status: 401,
        message: 'Please login again'
      })
    }
    req.user = {}
    let user
    try {
      user = jwt.verify(token, JWT_SECRET_USER)
    } catch (err) {
      return res.status(401).jsonp({
        status: 401,
        message: 'Please login again'
      })
    }

    if (!user) {
      return res.status(401).jsonp({
        status: 401,
        message: 'Please login again'
      })
    }

    const userData = await UsersModel.findOne({ _id: user._id, sJwtToken: token }).lean()
    if (!userData) {
      return res.status(401).jsonp({
        status: 401,
        message: 'Please login again'
      })
    }

    req.user = user
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).jsonp({
        status: 422,
        errors: errors.array()
      })
    }

    return next()
  } catch (error) {
    return catchError('isUserAuthenticated', error, req, res)
  }
}

module.exports = {
  validate,
  isUserAuthenticated
}
