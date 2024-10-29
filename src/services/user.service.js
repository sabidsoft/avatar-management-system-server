const User = require("../models/User");

exports.createNewUser = async (data) => {
    const user = await User.create(data);
    return user;
}

exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

exports.getUserByUserId = async (userId) => {
    const user = await User.findOne({ _id: userId });
    return user;
}

exports.getFacebookUserService = async (facebookId) => {
    const user = await User.findOne({ facebookId });
    return user;
}

exports.getFacebookUsersService = async () => {
    const users = await User.find({ registerWith: 'facebook' });
    return users;
}

exports.updateFacebookUserService = async (facebookId, data) => {
    const result = await User.updateOne({ facebookId: facebookId }, { $set: data }, { runValidators: true });
    return result;
}