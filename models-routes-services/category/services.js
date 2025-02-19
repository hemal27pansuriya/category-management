const CategoryModel = require('./model')
const { catchError } = require('../../helper/utilities.services')

const categoryService = {}

// Create category
categoryService.createCategory = async (req, res) => {
  try {
    console.log('******************************', req.body)
    const { sName, iParentId, eStatus } = req.body

    if (iParentId) {
      const parentCategory = await CategoryModel.findOne({ eStatus: 'Y', _id: iParentId }).lean()
      if (!parentCategory) return res.status(404).jsonp({ status: 404, message: 'Parent Category not found' })
    }

    const category = await CategoryModel.create({ sName, iParentId, eStatus })

    res.status(200).json({
      status: 200,
      message: 'CategoryModel created successfully',
      data: category
    })
  } catch (error) {
    return catchError('categoryService.createCategory', error, req, res)
  }
}

// Fetch all categories in tree structure
categoryService.fetchAllCategories = async (req, res) => {
  try {
    const { start = 0, limit = 10 } = req.query
    const categories = await CategoryModel.find().skip(start).limit(limit).lean()

    const categoryTree = buildTree(categories)
    return res.status(200).json({ success: 200, message: 'Category fetched successfully', categories: categoryTree })
  } catch (error) {
    return catchError('categoryService.fetchAllCategories', error, req, res)
  }
}

// Fetch a single category by ID
categoryService.fetchCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id).lean()
    if (!category) return res.status(404).json({ success: 404, message: 'CategoryModel not found' })

    const children = await CategoryModel.find({ iParentId: req.params.id }).lean()

    return res.status(200).json({ success: 200, data: { ...category, children } })
  } catch (error) {
    return catchError('categoryService.fetchCategoryById', error, req, res)
  }
}

// Update category (name, status)
categoryService.updateCategory = async (req, res) => {
  try {
    const { sName, eStatus } = req.body
    const category = await CategoryModel.findById(req.params.id)
    if (!category) return res.status(404).json({ success: 404, message: 'CategoryModel not found' })

    if (sName) category.sName = sName
    if (eStatus) category.eStatus = eStatus
    if (category.eStatus === 'N') {
      await CategoryModel.updateMany({ iParentId: req.params.id }, { $set: { eStatus: 'N' } })
    }

    await category.save()

    return res.status(200).json({ success: 200, message: 'CategoryModel updated successfully', data: category })
  } catch (error) {
    return catchError('categoryService.updateCategory', error, req, res)
  }
}

// Delete category and reassign subcategories
categoryService.deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ success: 404, message: 'CategoryModel not found' })

    // Reassign children to parent
    await CategoryModel.updateMany({ iParentId: category._id }, { iParentId: category.iParentId })

    return res.status(200).json({ success: 200, message: 'CategoryModel deleted successfully' })
  } catch (error) {
    return catchError('categoryService.deleteCategory', error, req, res)
  }
}

module.exports = categoryService

function buildTree (categories) {
  const map = {} // A map to hold categories by their _id
  const roots = [] // To hold the root categories (those without parents)

  // Populate map with categories and initialize an empty children array
  categories.forEach((category) => {
    map[category._id] = { ...category, children: [] }
  })

  // Build the tree: Assign children to their parent categories
  categories.forEach((category) => {
    if (category.iParentId) {
      // If category has a parent, push it to the parent's children array
      map[category.iParentId].children.push(map[category._id])
    }
    // If category has no parent, it is a root category
    roots.push(map[category._id])
  })

  return roots
};
