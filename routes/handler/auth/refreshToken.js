const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../../../models')
const {
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
} = process.env;

module.exports = async (req, res) => {
    console.log('access');
    try {
        const refreshToken = req.body.refreshToken;
        const email = req.body.email;

        if (!refreshToken || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid token'
            });
        }

        let refreshTokenExist = await RefreshToken.findOne({
            where: {
                token: refreshToken,
            }
        });

        jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
            console.log('decoded', decoded);
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: err.message,
                });
            }

            if (decoded.user.email !== email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid email'
                });
            }

            const token = jwt.sign({ user: decoded.user }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });

            return res.status(200).json({
                status: 'success',
                data: { token }
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}