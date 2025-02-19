/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../index')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const UserModel = require('../models-routes-services/users/auth/model')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_USER } = require('../config/defaultConfig')

// Mock the services layer
jest.mock('../models-routes-services/category/services.js')

// Increase timeout for all tests in this file
jest.setTimeout(60000) // Set timeout to 60 seconds for all tests

describe('CategoryController', () => {
  let authToken = ''
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

    const user = await UserModel.create({
      sUsername: 'testuserx3',
      sEmail: 'testx3@example.com',
      sMobNum: '1234337892',
      sPassword: 'Password123'
    })

    authToken = jwt.sign({ _id: user._id.toString() }, JWT_SECRET_USER, { expiresIn: '1h' })
    await UserModel.updateOne({ _id: user._id }, { $set: { sJwtToken: authToken } })
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  describe('POST /categories', () => {
    it('should successfully create a category', async () => {
      const category = {
        sName: 'Laptops',
        eStatus: 'Y'
      }

      const response = await request(app)
        .post('/api/category')
        .set('Authorization', authToken)
        .send(category)
        .expect(200)

      expect(response.body.message).toBe('Category created successfully')
      expect(response.body.data.sName).toBe(category.sName)
    })

    it('should return error if name is missing', async () => {
      const category = {
        eStatus: 'Y'
      }

      const response = await request(app)
        .post('/api/category')
        .set('Authorization', authToken)
        .send(category)
        .expect(422)

      expect(response.body.message).toBe('Category name is required')
    })
  })

  describe('GET /categories', () => {
    it('should fetch categories in tree structure', async () => {
      const response = await request(app)
        .get('/api/get-categories')
        .set('Authorization', authToken)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.categories)).toBe(true)
    })
  })

  describe('PUT /categories/:id', () => {
    it('should update category details', async () => {
      const category = await CategoryModel.create({ sName: 'Laptops', eStatus: 'Y' })
      const updatedCategory = { sName: 'Gaming Laptops', eStatus: 'Y' }

      const response = await request(app)
        .put(`/api/category/${category._id}`)
        .set('Authorization', authToken)
        .send(updatedCategory)
        .expect(200)

      expect(response.body.message).toBe('Category updated successfully')
      expect(response.body.data.sName).toBe(updatedCategory.sName)
    })
  })

  describe('DELETE /categories/:id', () => {
    it('should delete a category', async () => {
      const category = await CategoryModel.create({ sName: 'Laptops', eStatus: 'Y' })

      const response = await request(app)
        .delete(`/api/category/${category._id}`)
        .set('Authorization', authToken)
        .expect(200)

      expect(response.body.message).toBe('Category deleted and subcategories reassigned')
    })
  })
})
