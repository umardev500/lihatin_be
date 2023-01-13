const { User, RefreshToken } = require('../../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Validator = require('fastest-validator');
const v = new Validator();

const {
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED,
} = process.env;

module.exports = async (req, res) => {
    const schema = {
        name: 'string|empty:false|min:4',
        email: 'email|empty:false',
        password: 'string|empty:false|min:6'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        })
    }

    const emailUser = await User.findOne({
        where: { email: req.body.email }
    })

    if (emailUser) {
        return res.status(409).json({
            status: 'error',
            message: [{
                field: 'email',
                message: 'email already exists'
            }]
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
    const refreshToken = jwt.sign({ user }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED })

    await RefreshToken.create({
        token: refreshToken,
        user_id: user.id
    })

    return res.status(201).json({
        status: 'success',
        data: {
            refreshToken: refreshToken,
            token: token,
            user
        }
    })
}