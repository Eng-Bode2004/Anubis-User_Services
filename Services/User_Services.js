const User_Schema = require('../Models/User_Schema');
const bcrypt = require('bcryptjs');

class User_Service {
    async createUser(userData) {
        try {
            const { phone_Number, email, username, password } = userData;

            // --- Build dynamic $or query ---
            const conditions = [];
            if (phone_Number) conditions.push({ phone_Number });
            if (email) conditions.push({ email });
            if (username) conditions.push({ username });

            if (conditions.length > 0) {
                const existUser = await User_Schema.findOne({ $or: conditions });
                if (existUser) {
                    // custom message for clarity
                    if (existUser.phone_Number === phone_Number)
                        throw new Error('Phone number already registered');
                    if (existUser.email === email)
                        throw new Error('Email already registered');
                    if (existUser.username === username)
                        throw new Error('Username already taken');
                }
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User_Schema({
                phone_Number: phone_Number || null,
                email: email || null,
                username,
                password: hashedPassword,
            });

            await user.save();
            return user;
        } catch (error) {
            throw new Error(error.message || 'Error while creating user');
        }
    }


    async AssignRole(userId,RoleId){
        try {

            // Check if User is its doesnt exists
            const existUser =  await User_Schema.findById(userId);
            if (!existUser) {
                throw new Error('User not found');
            }

            // Assign Role
            const userRole = await User_Schema.findByIdAndUpdate(userId,{
                $set: {Role: RoleId}


            },{ new: true })

            return userRole;

        }catch (error) {
            throw new Error(error.message || 'Error while assigning role');
        }

    }
}

module.exports = new User_Service();
