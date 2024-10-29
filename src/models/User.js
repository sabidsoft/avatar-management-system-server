const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: function () {
            return this.registerWith === 'email'; // Require password only for email registrations
        },
        minlength: 6,
        sparse: true // Allows documents without password for Facebook users
    },

    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
    },

    registerWith: {
        type: String,
        required: true,
        enum: ['facebook', 'email'],
    },

    facebookId: {
        type: String, // Store Facebook ID for Facebook users
        unique: true,
        sparse: true // Allows documents without facebook id for email users
    },

    gender: {
        type: String
    },

    birthday: {
        type: String
    },

    hometown: {
        type: String
    },

    location: {
        type: String
    },

    link: {
        type: String
    },

    profilePicture: {
        type: String
    },

    accessToken: {
        type: String
    },

    expiresIn: {
        type: Number
    },

    dataAccessExpirationTime: {
        type: Number
    },

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpires: {
        type: Date,
    },
}, { timestamps: true });

// Hash password before saving or updating
userSchema.pre('save', async function (next) {
    // Only hash the password if the user is registering with email
    if (this.isModified('password') && this.registerWith === 'email') {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to change the user's password
userSchema.methods.changePassword = async function (oldPassword, newPassword) {
    const isMatch = await this.comparePassword(oldPassword);
    if (!isMatch) {
        throw new Error('Old password is incorrect');
    }

    this.password = await bcrypt.hash(newPassword, 10);
    await this.save();
};

// Method to generate a password reset token
userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(64).toString('hex');
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    return resetToken;
};

// Method to reset the password using the reset token
userSchema.methods.resetPassword = async function (token, newPassword) {
    if (this.resetPasswordToken !== token || Date.now() > this.resetPasswordExpires) {
        throw new Error('Password reset token is invalid or has expired');
    }

    this.password = await bcrypt.hash(newPassword, 10);

    // Clear reset token and expiration fields
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;

    await this.save();
};

// User model
const User = model('User', userSchema);

module.exports = User;
