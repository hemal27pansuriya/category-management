# category-management# API Project

A RESTful API project built with Express.js that handles user authentication and category management.

## Features

- User Authentication (Register/Login)
- Category Management (CRUD operations)
- Input validation
- Protected routes with authentication middleware

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- MongoDB (Make sure MongoDB is installed and running)

## Installation

1. Clone the repository:

git clone <repository-url>

cd <project-directory>


2. Install dependencies:

npm install


3. Create a `.env` file in the root directory with the following variables:


PORT=3000

MONGODB_URI=mongodb://localhost:27017/your_database

JWT_SECRET=your_jwt_secret_key


4. Start the server:

npm run dev

## Sample Response: 
### status - status code
### message - response message
### data - data of entity