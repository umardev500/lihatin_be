const { User } = require('../../../models');

module.exports = async (req, res) => {
    console.log(req.user);
    const user = await User.findByPk(req.user.id, {
        exclude: ['password']
    });
    res.json({
        status: 'success',
        data: user,
    });
}