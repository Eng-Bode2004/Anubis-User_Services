module.exports = function validateUserCreation(req, res, next) {
    const { phone_Number, email, username, password, confirm_Password } = req.body;


    // Check 1: Must provide AT LEAST one contact method
    if (!phone_Number && !email) {
        return res.status(400).json({
            status: 'error',
            message: 'A phone number OR an email address is required.',
        });
    }

    // Check 2: Username
    if (!username) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter username.',
        });
    }

    // Check 3 & 4: Password and Confirmation
    if (!password) {
        return res.status(400).json({
            status: 'error',
            message: 'Password required.',
        });
    }

    if (!confirm_Password) {
        return res.status(400).json({
            status: 'error',
            message: 'Please confirm the password.',
        });
    }

    // Check 5: Passwords must match
    if (password !== confirm_Password) {
        return res.status(400).json({
            status: 'error',
            message: 'Passwords do not match.',
        });
    }

    // --- 2. FORMAT AND STRENGTH VALIDATION ---

    // A. Username Validation
    if (username.length < 7) {
        return res.status(400).json({
            status: 'error',
            message: 'Username must be at least 7 characters long.',
        });
    }

    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            status: 'error',
            message: 'Username can only contain letters, numbers, underscores, and dots.',
        });
    }

    // B. Email Validation (if provided)
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format.',
            });
        }
    }

    // C. Password Strength Validation (All these already use 'return')
    const passwordPolicy = {
        minLength: 12,
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecialChar: /[^A-Za-z0-9]/,
    };

    if (password.length < passwordPolicy.minLength) {
        return res.status(400).json({
            status: 'error',
            message: `Password must be at least ${passwordPolicy.minLength} characters long.`,
        });
    }
    if (!passwordPolicy.hasUpperCase.test(password)) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must contain at least one uppercase letter.',
        });
    }
    if (!passwordPolicy.hasLowerCase.test(password)) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must contain at least one lowercase letter.',
        });
    }
    if (!passwordPolicy.hasNumber.test(password)) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must contain at least one number.',
        });
    }
    if (!passwordPolicy.hasSpecialChar.test(password)) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must contain at least one special character (e.g., !, @, #).',
        });
    }


    // D. Egyptian Phone Number Validation (if provided)
    if (phone_Number) {
        const phoneString = String(phone_Number).trim();

        // 1. Check for 11 digits
        if (phoneString.length !== 11) {
            return res.status(400).json({
                status: 'error',
                message: 'Phone number must be exactly 11 digits long for Egyptian mobiles.',
            });
        }

        // 2. Check for starting prefixes (010, 011, 012, 015)
        const egyptianMobileRegex = /^(010|011|012|015)\d{8}$/;

        if (!egyptianMobileRegex.test(phoneString)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Egyptian mobile number. Must start with 010, 011, 012, or 015.',
            });
        }
    }


    next();
};