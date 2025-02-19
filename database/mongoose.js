const mongoose = require('mongoose')
const { handleCatchError } = require('../helper/utilities.services')

const config = require('../config/config')

const DBConnect = connection(config.DB_URL, 'MongoDB')

function connection (DB_URL, DB = '') {
  try {
    const dbConfig = { readPreference: 'secondaryPreferred' }

    const conn = mongoose.createConnection(DB_URL, dbConfig)
    conn.on('connected', () => console.log(`Connected to ${DB}.`))
    return conn
  } catch (error) {
    handleCatchError(error)
  }
}
// mongoose.set('debug', true)
module.exports = {
  DBConnect
}
