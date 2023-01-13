const { Link } = require('../../../models');

module.exports = async (req, res) => {
    const { short } = req.params
    const link = await Link.findOne({
        where: { short }
    });

    if (link) {
        link.views++
        await link.save()
        return res.redirect(link.url)
    } else {
        return res.redirect(`${process.env.FRONTEND_URL}`)
    }
}