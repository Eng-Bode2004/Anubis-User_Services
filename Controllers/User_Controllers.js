const User_Service = require( "../Services/User_Services" )

class User_Controller {

    async createUser(req,res){
        try {
            const userData = req.body;

            const user = await User_Service.createUser(userData);
            res.status(200).json({
                status: "success",
                user: user,
                statusCode: 200,
            });





        }catch (error) {
            res.status(500).json({
                status: "error",
                statusCode: 500,
                error: error.message,
            })
        }


    }

    async AssignRole(req, res) {
        try {
            const { RoleId } = req.body;
            const { userId } = req.params;

            const UserRole = await User_Service.AssignRole(userId, RoleId);

            res.status(200).json({
                status: "success",
                message: "Role assigned successfully",
                data: UserRole
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                statusCode: 500,
                error: error.message,
            });
        }
    }




}

module.exports = new User_Controller;