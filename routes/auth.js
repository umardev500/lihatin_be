const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

const { register, login, logout, me, refreshToken } = require('./handler/auth');

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logout)

router.post('/refresh-token', refreshToken)

router.get('/me', verifyToken, me)

module.exports = router