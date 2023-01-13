
const express = require('express');
const router = express.Router();

const { redirect } = require('./handler/links');;

router.get('/:short', redirect)

module.exports = router;