const { body } = require('express-validator')

const createCategory = [
  body('sName').not().isEmpty().isString(),
  body('iParentId').optional().isMongoId(),
  body('eStatus').optional().isIn(['Y', 'N'])
]

const updateCategory = [
  body('sName').optional().isString(),
  body('eStatus').optional().isIn(['Y', 'N'])
]

module.exports = {
  createCategory,
  updateCategory
}
