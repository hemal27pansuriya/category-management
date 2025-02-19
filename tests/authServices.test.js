/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../index') // Import the server instance
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const UserModel = require('../models-routes-services/users/auth/model')

jest.mock('../models-routes-services/users/auth/services.js') // Mocking the services layer

describe('AuthController', () => {
  let mockCreate
  let mockFindOne

  beforeAll(async () => {
    // await mongoose.connect('mongodb://localhost:27017/test_db', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // })
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  })

  beforeEach(() => {
    jest.clearAllMocks() // Clear mock history before each test

    // Mock the UserModel methods
    mockCreate = jest.spyOn(UserModel, 'create')
    mockFindOne = jest.spyOn(UserModel, 'findOne')
  })

  afterAll(async () => {
    // await mongoose.connection.close()
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  describe('POST /api/auth/register', () => {
    it('should successfully register a user', async () => {
      const newUser = {
        sUsername: 'testuser',
        sEmail: 'test@example.com',
        sMobNum: '1234567890',
        sPassword: 'Password123'
      }

      // Mock successful user creation
      mockCreate.mockResolvedValueOnce(newUser) // Resolve with the new user data

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(200)

      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.data.sUsername).toBe(newUser.sUsername)
      expect(mockCreate).toHaveBeenCalledWith(newUser) // Check if create was called with correct arguments
    })

    it('should return error if the user already exists', async () => {
      const existingUser = {
        sUsername: 'testuser',
        sEmail: 'test@example.com',
        sMobNum: '1234567890',
        sPassword: 'Password123'
      }

      // Mock to throw error for existing user
      mockCreate.mockRejectedValueOnce(new Error('User already exists')) // Reject with error

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser)
        .expect(409) // Conflict for existing user

      expect(response.body.message).toBe('User already exists')
      expect(mockCreate).toHaveBeenCalledWith(existingUser) // Check if create was called with correct arguments
    })
  })

  describe('POST /api/auth/login', () => {
    it('should successfully login the user', async () => {
      const user = {
        sUsername: 'testuser',
        sPassword: 'Password123'
      }

      // Mock successful user find and password comparison
      mockFindOne.mockResolvedValueOnce({
        ...user,
        comparePassword: jest.fn().mockResolvedValueOnce(true) // Mock password comparison
      })

      const response = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(200)

      expect(response.body.message).toBe('Logged In successful')
      expect(response.body.data.sUsername).toBe(user.sUsername)
      expect(mockFindOne).toHaveBeenCalledWith({ sUsername: user.sUsername })
    })

    it('should return error for invalid credentials', async () => {
      const invalidUser = {
        sUsername: 'wronguser',
        sPassword: 'WrongPassword'
      }

      // Mock user not found
      mockFindOne.mockResolvedValueOnce(null) // Resolve with null to simulate not found user

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidUser)
        .expect(400)

      expect(response.body.message).toBe('Please enter valid credentials')
      expect(mockFindOne).toHaveBeenCalledWith({ sUsername: invalidUser.sUsername })
    })
  })
})
