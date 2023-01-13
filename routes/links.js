const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const { get, create, update, show } = require('./handler/links');

router.get('/', verifyToken, get)
router.post('/', create)
router.put('/:id', verifyToken, update)
router.get('/:short', show)

module.exports = router