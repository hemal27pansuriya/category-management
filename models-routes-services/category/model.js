const mongoose = require('mongoose')
const { DBConnect } = require('../../database/mongoose')

const CategorySchema = new mongoose.Schema({
  sName: { type: String, required: true },
  iParentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  eStatus: { type: String, enum: ['Y', 'N'], default: 'Y' } // 'eStatus' for status
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

// Index for fast parentCategory lookup
CategorySchema.index({ iParentId: 1 })

const Category = DBConnect.model('Category', CategorySchema)

Category.syncIndexes().then(() => {
  console.log('Category Model Indexes Synced')
}).catch((err) => {
  console.log('Category Model Indexes Sync Error', err)
})

module.exports = Category
