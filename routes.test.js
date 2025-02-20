const request = require('supertest')
const express = require('express')
const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

require('./middlewares/routes')(app)

let token // Variable to hold the JWT token
let catId // Variable to hold the category ID

describe('User Authentication Routes', () => {
  test('should register a user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        sUsername: 'testuser',
        sMobNum: '1234567890',
        sEmail: 'testuser@example.com',
        sPassword: 'password123'
      })
    expect(response.status).toBe(200)
  })

  test('should login a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        sUsername: 'testuser',
        sPassword: 'password123'
      })
    expect(response.status).toBe(200)
    token = response.body.Authorization
  })

  test('should fail to login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        sUsername: 'wronguser',
        sPassword: 'wrongpassword'
      })
    expect(response.status).toBe(400)
  })
})

describe('Category Management Routes', () => {
  test('should create a category', async () => {
    const response = await request(app)
      .post('/api/category')
      .set('Authorization', token)
      .send({
        sName: 'New Category'
      })
    expect(response.status).toBe(200)
    catId = response.body.data._id
  })

  test('should fetch all categories', async () => {
    const response = await request(app)
      .get('/api/get-categories')
      .set('Authorization', token)
    expect(response.status).toBe(200)
  })

  test('should fetch a single category by ID', async () => {
    const response = await request(app)
      .get(`/api/category/${catId}`)
      .set('Authorization', token)
    expect(response.status).toBe(200)
  })

  test('should fail to fetch a category with invalid ID', async () => {
    const response = await request(app)
      .get('/api/category/67b6b6e8a9bad8da8629eede')
      .set('Authorization', token)
    expect(response.status).toBe(404)
  })
})
