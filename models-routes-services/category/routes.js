const router = require('express').Router()
const { isUserAuthenticated } = require('../../middlewares/middleware')
const services = require('./services')
const validators = require('./validators')

// Create Category
router.post('/category', validators.createCategory, isUserAuthenticated, services.createCategory)

// Fetch all categories
router.get('/get-categories', isUserAuthenticated, services.fetchAllCategories)

// Fetch single category by ID
router.get('/category/:id', isUserAuthenticated, services.fetchCategoryById)

// Update category
router.put('/category/:id', validators.updateCategory, isUserAuthenticated, services.updateCategory)

// Delete category
router.delete('/category/:id', isUserAuthenticated, services.deleteCategory)

module.exports = router
