const { Link } = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();
const QRCode = require('qrcode');

module.exports = async (req, res) => {
    const schema = {
        url: 'url|empty:false',
        short: 'string|empty:false|min:3|max:50',
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    const link = await Link.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'user_id', 'url', 'short', 'views', 'createdAt'],
    });

    if (!link) {
        return res.status(404).json({
            status: 'error',
            message: 'link not found'
        });
    }

    if (link.user_id !== req.user.id) {
        return res.status(403).json({
            status: 'error',
            message: 'Access forbidden'
        });
    }

    const oldLink = await Link.findOne({
        where: { short: req.body.short },
    })

    if (oldLink && oldLink.id != req.params.id) {
        return res.status(409).json({
            status: 'error',
            message: [{
                field: 'short',
                message: 'short link already exists'
            }]
        });
    }

    await Link.update(req.body, {
        where: { id: req.params.id }
    });

    QRCode.toFile(`./public/images/qr/${link.id}.png`, `${process.env.BASE_URL}/${link.short}`, { type: 'png', errorCorrectionLevel: 'M', width: 300, margin: 1 });

    res.status(200).json({
        status: 'success',
    });
}