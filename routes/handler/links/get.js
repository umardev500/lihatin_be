const { Link } = require('../../../models');

module.exports = async (req, res) => {
    const user_id = req.user.id;

    const links = await Link.findAll({
        where: { user_id: user_id },
        attributes: ['id', 'url', 'short', 'views', 'createdAt', 'encodeurl'],
        order: [['createdAt', 'DESC']],
    });

    return res.json({
        status: 'success',
        data: links,
    });
}