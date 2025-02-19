const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../../../database/mongoose')

const User = new Schema({
  sUsername: { type: String, trim: true, required: true, unique: true },
  sEmail: { type: String, trim: true, required: true, unique: true },
  sMobNum: { type: String, trim: true, required: true, unique: true },
  eStatus: { type: String, enum: ['Y', 'N'], default: 'Y' },
  sPassword: { type: String, trim: true, default: null },
  sJwtToken: { type: String }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

User.index({ dCreatedAt: 1 })

const UserModel = DBConnect.model('users', User)

UserModel.syncIndexes().then(() => {
  console.log('User Model Indexes Synced')
}).catch((err) => {
  console.log('User Model Indexes Sync Error', err)
})

module.exports = UserModel
