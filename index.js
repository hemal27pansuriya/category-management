const express = require('express')
const app = express() // Initialize the express application
const config = require('./config/config')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')

global.appRootPath = __dirname // Set the root path of the application globally

require('./database/mongoose') // Connect to the MongoDB database using Mongoose

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(hpp())
require('./middlewares/routes')(app) // Load the routes into the express application


app.listen(config.PORT, () => console.log('Magic happens on port :' + config.PORT))

module.exports = app
