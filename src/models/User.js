const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: String,
    email: String,
    profilePicture: String,
    facebookId: String,
    accessToken: String,
    expiresIn: Number,
    dataAccessExpirationTime: Number
}, {
    timestamps: true
})

const User = model("User", userSchema);

module.exports = User;
