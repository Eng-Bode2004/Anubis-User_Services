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

    async assignProfile(req, res) {
        try {
            const { profileId } = req.body;
            const { userId } = req.params;

            if (!profileId) {
                return res.status(400).json({
                    status: "error",
                    message: "Profile ID is required in the body",
                });
            }

            const updatedUser = await User_Service.assignProfile(userId, profileId);

            res.status(200).json({
                status: "success",
                message: "Profile assigned successfully",
                data: updatedUser,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                statusCode: 500,
                error: error.message,
            });
        }
    }

    async loginUser(req, res) {
        try {
            const { identifier, password } = req.body;

            const user = await User_Service.loginUser({ identifier, password });

            res.status(200).json({
                status: "success",
                message: "Login successful",
                data: user
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        }
    }



}

module.exports = new User_Controller;