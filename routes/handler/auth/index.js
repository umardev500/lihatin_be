const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const me = require('./me');
const refreshToken = require('./refreshToken');

module.exports = { register, login, logout, me, refreshToken };