const axios = require('axios');
const cron = require('node-cron');
const { generateToken } = require("../utils/generateToken");
const { successResponse } = require("../utils/response");
const {
    getUserByEmail,
    updateUserByFacebookId,
    createNewUser,
    getUsersService,
    getUserByFacebookId,
} = require("../services/user.service");

/**
 * Facebook login with short-lived access token (validity for 2 hours)
 */
// exports.facebookLogin = async (req, res, next) => {
//     try {
//         const {
//             name,
//             email,
//             profilePicture,
//             accessToken,
//             facebookId,
//             expiresIn,
//             dataAccessExpirationTime
//         } = req.body;

//         const user = await getUserByEmail(email);

//         // If the user exists, update their data
//         if (user) {
//             const result = await updateUserByFacebookId(user.facebookId, {
//                 name,
//                 email,
//                 profilePicture,
//                 accessToken,
//                 facebookId,
//                 expiresIn,
//                 dataAccessExpirationTime
//             });

//             const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

//             successResponse(res, {
//                 status: 200,
//                 message: "Login successful and user data updated",
//                 payload: { user, token, result }
//             });
//         }

//         // If the user does not exist, create a new user
//         else {
//             const user = await createNewUser({
//                 name,
//                 email,
//                 profilePicture,
//                 accessToken,
//                 facebookId,
//                 expiresIn,
//                 dataAccessExpirationTime
//             });

//             const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

//             successResponse(res, {
//                 status: 200,
//                 message: "New user created successfully",
//                 payload: { user, token }
//             });
//         }
//     }
//     catch (err) {
//         next(err);
//     }
// }

/**
 * Facebook login with long-lived access token (validity for 60 days)
 */
// exports.facebookLogin = async (req, res, next) => {
//     try {
//         const {
//             name,
//             email,
//             profilePicture,
//             accessToken, // short-lived token
//             facebookId,
//             dataAccessExpirationTime
//         } = req.body;

//         // Exchange the short-lived token for a long-lived access token (start code)
//         let longLivedAccessToken;
//         let longLivedExpiresIn;

//         try {
//             const tokenResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
//                 params: {
//                     grant_type: 'fb_exchange_token',
//                     client_id: process.env.FACEBOOK_APP_ID,
//                     client_secret: process.env.FACEBOOK_APP_SECRET,
//                     fb_exchange_token: accessToken
//                 }
//             });

//             longLivedAccessToken = tokenResponse.data.access_token;
//             longLivedExpiresIn = tokenResponse.data.expires_in;
//         }
//         catch (tokenError) {
//             return next(tokenError);
//         }
//         // Exchange the short-lived token for a long-lived access token (end code)

//         const user = await getUserByEmail(email);

//         // If the user exists, update their data
//         if (user) {
//             const result = await updateUserByFacebookId(user.facebookId, {
//                 name,
//                 email,
//                 facebookId,
//                 profilePicture,
//                 accessToken: longLivedAccessToken,
//                 expiresIn: longLivedExpiresIn,
//                 dataAccessExpirationTime
//             });

//             const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

//             successResponse(res, {
//                 status: 200,
//                 message: "Login successful and user data updated",
//                 payload: { user, token, result }
//             });
//         }

//         // If the user does not exist, create a new user
//         else {
//             const user = await createNewUser({
//                 name,
//                 email,
//                 facebookId,
//                 profilePicture,
//                 accessToken: longLivedAccessToken,
//                 expiresIn: longLivedExpiresIn,
//                 dataAccessExpirationTime
//             });

//             const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

//             successResponse(res, {
//                 status: 200,
//                 message: "New user created successfully",
//                 payload: { user, token }
//             });
//         }
//     }
//     catch (err) {
//         next(err);
//     }
// }

/**
 * Facebook login with long-lived access token and refresh token after 55 days
 */
exports.facebookLogin = async (req, res, next) => {
    try {
        const {
            name,
            email,
            profilePicture,
            accessToken, // short-lived token
            facebookId,
            dataAccessExpirationTime
        } = req.body;

        // Exchange the short-lived token for a long-lived access token (start code)
        let longLivedAccessToken;
        let longLivedExpiresIn;

        try {
            const tokenResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: process.env.FACEBOOK_APP_ID,
                    client_secret: process.env.FACEBOOK_APP_SECRET,
                    fb_exchange_token: accessToken
                }
            });

            longLivedAccessToken = tokenResponse.data.access_token;
            longLivedExpiresIn = tokenResponse.data.expires_in;
        } catch (tokenError) {
            return next(tokenError);
        }
        // Exchange the short-lived token for a long-lived access token (end code)

        const user = await getUserByEmail(email);

        // If the user exists, update their data
        if (user) {
            const result = await updateUserByFacebookId(user.facebookId, {
                name,
                email,
                facebookId,
                profilePicture,
                accessToken: longLivedAccessToken,
                expiresIn: longLivedExpiresIn,
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
                facebookId,
                profilePicture,
                accessToken: longLivedAccessToken,
                expiresIn: longLivedExpiresIn,
                dataAccessExpirationTime
            });

            const token = generateToken({ facebookId }, process.env.JWT_SECRET_KEY, "365d");

            successResponse(res, {
                status: 200,
                message: "New user created successfully",
                payload: { user, token }
            });
        }

        // Schedule the token refresh (every 55 days)
        cron.schedule('0 0 1 */2 *', async () => {
            try {
                const response = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
                    params: {
                        grant_type: 'fb_exchange_token',
                        client_id: process.env.FACEBOOK_APP_ID,
                        client_secret: process.env.FACEBOOK_APP_SECRET,
                        fb_exchange_token: longLivedAccessToken
                    }
                });

                const newLongLivedToken = response.data.access_token;
                const newExpiresIn = response.data.expires_in;

                // Update the token and expiration time in database
                await updateUserByFacebookId(facebookId, {
                    accessToken: newLongLivedToken,
                    expiresIn: newExpiresIn
                });

            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        }, {
            timezone: "Asia/Dhaka"
        });

    } catch (err) {
        next(err);
    }
};

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
        const user = await getUserByFacebookId(req.params.facebookId);

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

exports.getUserPosts = async (req, res, next) => {
    try {
        const user = await getUserByFacebookId(req.params.facebookId);

        // Fetch the user's posts
        const response = await axios.get(
            `https://graph.facebook.com/v20.0/me/posts?access_token=${user.accessToken}&
            fields=id,message,created_time,updated_time,link,type,from,comments{message,from,created_time},privacy,attachments`
        );

        const posts = response.data.data;
        const paging = response.data.paging;

        const result = await axios.get(`https://graph.facebook.com/v17.0/2996079313867342_2087375438071072/comments?access_token=${user.accessToken}`);
        console.log(result.data)

        successResponse(res, {
            status: 200,
            message: "Posts returned by facebook id",
            payload: { posts, paging, result }
        })
    }
    catch (err) {
        next(err);
    }
}
