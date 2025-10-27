const User_Schema = require('../Models/User_Schema');

module.exports = async function AssignRole(req, res, next) {
    try {
        const { RoleId, roleId } = req.body;
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID not provided',
            });
        }

        if (!RoleId && !roleId) {
            return res.status(400).json({
                status: 'error',
                message: 'Role ID not provided',
            });
        }

        const idToUse = RoleId || roleId;

        const user = await User_Schema.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        if (user.Role && user.Role.toString() === idToUse) {
            return res.status(400).json({
                status: 'error',
                message: 'Role already assigned to this user',
            });
        }

        req.RoleId = idToUse;
        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};
