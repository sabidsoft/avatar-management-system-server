const { generateToken } = require("../utils/generateToken");
const { successResponse } = require("../utils/response");
const {
    getUserByEmail,
    updateUserByFacebookId,
    createNewUser,
    getUsersService,
    getUserService
} = require("../services/user.service");

exports.facebookLogin = async (req, res, next) => {
    try {
        const {
            name,
            email,
            profilePicture,
            accessToken,
            facebookId,
            expiresIn,
            dataAccessExpirationTime
        } = req.body;

        const user = await getUserByEmail(email);

        // If the user exists, update their data
        if (user) {
            const result = await updateUserByFacebookId(user.facebookId, {
                name,
                email,
                profilePicture,
                accessToken,
                facebookId,
                expiresIn,
                dataAccessExpirationTime
            });

            const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

            successResponse(res, {
                status: 200,
                message: "Login successful and user data updated",
                payload: { user, token, result }
            });
        }

        // If the user does not exist, create a new user
        else {
            const user = await createNewUser({
                name,
                email,
                profilePicture,
                accessToken,
                facebookId,
                expiresIn,
                dataAccessExpirationTime
            });

            const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

            successResponse(res, {
                status: 200,
                message: "New user created successfully",
                payload: { user, token }
            });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const users = await getUsersService();

        successResponse(res, {
            status: 200,
            message: "All users",
            payload: { users }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await getUserService(req.params.facebookId);

        successResponse(res, {
            status: 200,
            message: "User returned by facebook id",
            payload: { user }
        })
    }
    catch (err) {
        next(err);
    }
}
