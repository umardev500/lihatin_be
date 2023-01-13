const { Link } = require('../../../models');

module.exports = async (req, res) => {
    const link = await Link.findOne({
        where: { short: req.params.short },
        attributes: ['id', 'user_id', 'url', 'short', 'views', 'createdAt'],
    });

    if (!link) {
        return res.status(404).json({
            status: 'error',
            message: 'links not found',
        });
    }

    res.status(200).json({
        status: 'success',
        data: link,
    });
}