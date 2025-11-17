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


    async assignProfile(userId, profileId) {
        try {
            // 1️⃣ Check if user exists
            const existUser = await User_Schema.findById(userId);
            if (!existUser) {
                throw new Error('User not found');
            }


            // 3️⃣ Check if this profile already assigned to someone else
            const profileAlreadyAssigned = await User_Schema.findOne({ Profile: profileId });
            if (profileAlreadyAssigned) {
                throw new Error('This profile is already assigned to another user');
            }

            // 4️⃣ Check if user already has a profile assigned
            if (existUser.Profile && existUser.Profile.toString() === profileId) {
                throw new Error('This profile is already assigned to this user');
            }

            // 5️⃣ Assign profile to user
            const updatedUser = await User_Schema.findByIdAndUpdate(
                userId,
                { $set: { Profile: profileId } },
                { new: true }
            )// optional: populate profile details

            return updatedUser;

        } catch (error) {
            throw new Error(error.message || 'Error while assigning profile');
        }
    }


    async loginUser(userData) {
        try {
            const { identifier, password } = userData;

            if (!identifier || !password) {
                throw new Error('Email/Phone and Password are required');
            }

            const query = identifier.includes('@')
                ? { email: identifier }
                : { phone_Number: identifier };

            const user = await User_Schema.findOne(query);
            if (!user) {
                throw new Error('User not found with provided credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid Identifier or password');
            }

            if (user.is_active === false) {
                throw new Error('Your account is not active');
            }

            // Remove password and include RoleId
            const { password: _, ...userWithoutPassword } = user.toObject();

            return userWithoutPassword;
        } catch (error) {
            throw new Error(error.message || 'Error while logging in');
        }
    }


    async changeUsername(userId, newUsername) {
        try {
            if (!userId) throw new Error('User ID is required');
            if (!newUsername || typeof newUsername !== 'string')
                throw new Error('New username is required');

            // Validate username format
            if (newUsername.length < 7) {
                throw new Error('Username must be at least 7 characters long.');
            }
            const usernameRegex = /^[a-zA-Z0-9_.]+$/;
            if (!usernameRegex.test(newUsername)) {
                throw new Error('Username can only contain letters, numbers, underscores, and dots.');
            }

            // Check if username already exists
            const existingUser = await User_Schema.findOne({ username: newUsername });
            if (existingUser) {
                throw new Error('Username already taken');
            }

            // Update the username
            const updatedUser = await User_Schema.findByIdAndUpdate(
                userId,
                { $set: { username: newUsername } },
                { new: true }
            );

            if (!updatedUser) throw new Error('User not found');

            return updatedUser;
        } catch (error) {
            throw new Error(error.message || 'Error while changing username');
        }
    }



}

module.exports = new User_Service();
