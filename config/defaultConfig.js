module.exports = {
  PORT: process.env.PORT || 8080,
  JWT_SECRET_USER: process.env.JWT_SECRET_USER || 'testSecret',
  JWT_VALIDITY: process.env.JWT_VALIDITY || '5d'
}
