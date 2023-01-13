const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'unauthorized'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        return next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: error.message
        });
    }
}