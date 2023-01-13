const { Link } = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const QRCode = require('qrcode');
const Base64 = require('../../../base64/base64')
const {encode} = require("../../../base64/base64");

module.exports = async (req, res) => {
    console.log(req.body);
    const schema = {
        url: 'url|empty:false',
        short: 'string|optional',
        encodeurl: 'string|optional'
    }

    let encodeurl = ''
    let decode = ''

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate,
        });
    }

    function StringGen(len) {
        var text = "";
        for (var i = 0; i < len; i++) {
            text += hasil.charAt(Math.floor(Math.random() * hasil.length));
        }
        return text;
    }

    let { url, short } = req.body;

    if (short) {
        const oldLink = await Link.findOne({
            where: { short: short },
        })

        if (oldLink) {
            return res.status(404).json({
                status: 'error',
                message: [{
                    field: 'short',
                    message: 'short link already exists'
                }]
            });
        }
    } else {
        hasil = Base64.encode(url)
        console.log(hasil)
        decode = Base64.decode(hasil)
        console.log(decode)
        for (var i = 0; i < 1; i++) {
            var hasilAlgo = `${StringGen(Math.random() * (5 - 1) + 1)}`;
        }
        console.log(hasilAlgo);
        short = hasilAlgo;
        encodeurl = hasil // memasukkan encode url ke database
    }

    const token = req.headers?.authorization;
    let userId = null
    if (token != undefined) {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.user.id;
    }

    const link = await Link.create({
        url: url,
        short: short,
        user_id: userId,
        encodeurl: encodeurl,
    });

    QRCode.toFile(`./public/images/qr/${link.id}.png`, `${process.env.BASE_URL}/${link.short}`, { type: 'png', errorCorrectionLevel: 'M', width: 300, margin: 1 });

    return res.status(201).json({
        status: 'success',
        data: link
    });
}