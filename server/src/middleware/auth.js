const config = require('../shared/config')
const jwt = require('jsonwebtoken')
const JWT_SECRET = config('JWT_SECRET')

const createToken = (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    // TODO: save to mysql, token to redis

    // create token
    // TODO: set expire time ~ 2hours
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 300 })
    res.status(200).json({ auth: true, token })
}

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error('Token is not valid')
        error.status = 401  
        next(error)
      } else {
        req.decoded = decoded
        // TODO: pull id from redis
        res.userId = 1
        next()
      }
    });
  } else {
    const error = new Error('Auth token is not supplied')
    error.status = 401  
    next(error)
  }
};

module.exports = {
  checkToken: checkToken,
  createToken: createToken
}