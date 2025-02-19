const { JWT_SECRET_USER, JWT_VALIDITY } = require('../../../config/defaultConfig')
const { catchError } = require('../../../helper/utilities.services')
const UsersModel = require('./model')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(saltRounds)

const userAuth = {}

userAuth.register = async (req, res) => {
  try {
    const { sUsername, sEmail, sMobNum, sPassword } = req.body

    const isExist = await UsersModel.findOne({ $or: [{ sEmail }, { sMobNum }, { sUsername }] }).lean()
    if (isExist) return res.status(409).jsonp({ status: 409, message: 'User already exists' })

    const sProtectedPassword = bcrypt.hashSync(sPassword ?? '', salt)
    const userData = {
      sUsername,
      sEmail,
      sMobNum,
      sPassword: sProtectedPassword,
      eStatus: 'Y'
    }

    const user = await UsersModel.create(userData)
    const sToken = jwt.sign({ _id: (user._id).toString() }, JWT_SECRET_USER, { expiresIn: JWT_VALIDITY })

    await UsersModel.updateOne({ _id: user._id }, { $set: { sJwtToken: sToken } })
    return res.status(200).json({
      status: 200,
      message: 'User registered successfully',
      data: user,
      Authorization: sToken
    })
  } catch (error) {
    return catchError('userAuth.register', error, req, res)
  }
}

userAuth.login = async (req, res) => {
  try {
    const { sUsername, sPassword } = req.body

    const user = await UsersModel.findOne({ sUsername }).lean()
    if (!user || !bcrypt.compareSync(sPassword, user.sPassword)) return res.status(400).jsonp({ status: 400, message: 'Please enter valid credentials' })
    const sToken = jwt.sign({ _id: (user._id).toString() }, JWT_SECRET_USER, { expiresIn: JWT_VALIDITY })

    await UsersModel.updateOne({ _id: user._id }, { $set: { sJwtToken: sToken } })

    return res.status(200).json({
      status: 200,
      message: 'Logged In successful',
      data: user,
      Authorization: sToken
    })
  } catch (error) {
    return catchError('userAuth.login', error, req, res)
  }
}

module.exports = userAuth
