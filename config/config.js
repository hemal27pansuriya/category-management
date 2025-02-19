require('dotenv').config()
console.log(process.env.NODE_ENV || 'dev')
// Object for all Db related cred
const dbVar = require('./dbConfig')

// Object for all Default cred
const defaultVar = require('./defaultConfig')

const environment = {
  ...dbVar,
  ...defaultVar,
  NODE_ENV: process.env.NODE_ENV || 'dev'
}

module.exports = environment
