const axios = require('axios');
const cron = require('node-cron');
const createError = require("http-errors");
const { generateToken } = require("../utils/generateToken");
const { successResponse } = require("../utils/response");
const {
    createNewUser,
    getUserByEmail,
    updateFacebookUserService,
    getFacebookUserService,
    getFacebookUsersService,
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
//             const result = await updateFacebookUserService(user.facebookId, {
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
//             const result = await updateFacebookUserService(user.facebookId, {
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
//         } catch (tokenError) {
//             return next(tokenError);
//         }
//         // Exchange the short-lived token for a long-lived access token (end code)

//         const user = await getUserByEmail(email);

//         console.log(user)

//         // If the user exists, update their data
//         if (user) {
//             const result = await updateFacebookUserService(user.facebookId, {
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

//         // Schedule the token refresh (every 55 days)
//         cron.schedule('0 0 1 */2 *', async () => {
//             try {
//                 const response = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
//                     params: {
//                         grant_type: 'fb_exchange_token',
//                         client_id: process.env.FACEBOOK_APP_ID,
//                         client_secret: process.env.FACEBOOK_APP_SECRET,
//                         fb_exchange_token: longLivedAccessToken
//                     }
//                 });

//                 const newLongLivedToken = response.data.access_token;
//                 const newExpiresIn = response.data.expires_in;

//                 // Update the token and expiration time in database
//                 await updateFacebookUserService(facebookId, {
//                     accessToken: newLongLivedToken,
//                     expiresIn: newExpiresIn
//                 });

//             } catch (error) {
//                 console.error('Error refreshing token:', error);
//             }
//         }, {
//             timezone: "Asia/Dhaka"
//         });

//     } catch (err) {
//         next(err);
//     }
// };

exports.facebookLogin = async (req, res, next) => {
    try {
        const {
            name,
            email,
            role,
            registerWith,
            facebookId,
            profilePicture,
            accessToken, // short-lived token
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

        // Get additional data from Facebook
        const userInfoResponse = await axios.get(`https://graph.facebook.com/v20.0/me`, {
            params: {
                access_token: longLivedAccessToken,
                fields: 'link,gender,birthday,hometown,location'
            }
        });

        const { link, gender, birthday, hometown, location } = userInfoResponse.data;

        const user = await getUserByEmail(email);

        // If the user exists, update their data
        if (user) {
            const result = await updateFacebookUserService(user.facebookId, {
                name,
                email,
                role,
                registerWith,
                facebookId,
                profilePicture,
                accessToken: longLivedAccessToken,
                expiresIn: longLivedExpiresIn,
                dataAccessExpirationTime,
                link,
                gender,
                birthday,
                hometown: hometown?.name || null,
                location: location?.name || null,
            });

            const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

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
                role,
                registerWith,
                facebookId,
                profilePicture,
                accessToken: longLivedAccessToken,
                expiresIn: longLivedExpiresIn,
                dataAccessExpirationTime,
                link,
                gender,
                birthday,
                hometown: hometown?.name || null,
                location: location?.name || null,
            });

            const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

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
                await updateFacebookUserService(facebookId, {
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

exports.emailLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email)
            throw createError(400, "Please provide your email address.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        if (!password)
            throw createError(400, "Please provide your password.");

        const user = await getUserByEmail(email);

        if (!user)
            throw createError(400, "Account not available. Please create an account first.");

        const isMatch = await user.comparePassword(password);

        if (!isMatch)
            throw createError(400, "Your email or password isn't correct.");

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign in successfull.",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.emailSignUp = async (req, res, next) => {
    try {
        const { name, email, role, registerWith, hometown, location, gender, birthday, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!name)
            throw createError(400, "Name is required.");

        if (name.length < 3)
            throw createError(400, "Name is too short.");

        if (name.length > 30)
            throw createError(400, "Name is too big.");

        if (!email)
            throw createError(400, "Email is required.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        if (!role)
            throw createError(400, "Role is required");

        if (!registerWith)
            throw createError(400, "RegisterWith data is required");

        if (!hometown)
            throw createError(400, "Hometown is required");

        if (!location)
            throw createError(400, "Location is required");

        if (!gender)
            throw createError(400, "Gender is required");

        if (!birthday)
            throw createError(400, "Birthday is required");

        if (!password)
            throw createError(400, "Password is required.");

        if (password.length < 6)
            throw createError(400, "Password should be at least 6 characters long.");

        if (password.length > 40)
            throw createError(400, "Password is too long.");

        const isUserExist = await getUserByEmail(email);

        if (isUserExist)
            throw createError(400, "User allready exist.");

        const user = await createNewUser(req.body);

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign up successfull.",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.adminEmailSignUp = async (req, res, next) => {
    try {
        const { name, email, role, registerWith, hometown, location, gender, birthday, adminCode, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const adminRegisterCode = 'Avatar113355';

        if (!name)
            throw createError(400, "Name is required!");

        if (name.length < 3)
            throw createError(400, "Name is too short!");

        if (name.length > 30)
            throw createError(400, "Name is too big!");

        if (!email)
            throw createError(400, "Email is required!");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address!");

        if (!role)
            throw createError(400, "Role is required!");

        if (!registerWith)
            throw createError(400, "RegisterWith data is required!");

        if (!hometown)
            throw createError(400, "Hometown is required!");

        if (!location)
            throw createError(400, "Location is required!");

        if (!gender)
            throw createError(400, "Gender is required!");

        if (!birthday)
            throw createError(400, "Birthday is required!");

        if (!adminCode)
            throw createError(400, "Admin code is required!");

        if (adminCode !== adminRegisterCode)
            throw createError(400, "Admin register code was wrong!");

        if (!password)
            throw createError(400, "Password is required!");

        if (password.length < 6)
            throw createError(400, "Password should be at least 6 characters long!");

        if (password.length > 40)
            throw createError(400, "Password is too long!");

        const isUserExist = await getUserByEmail(email);

        if (isUserExist)
            throw createError(400, "User already exist!");

        const user = await createNewUser(req.body);

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign up successfull!",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getFacebookUsers = async (req, res, next) => {
    try {
        const users = await getFacebookUsersService();

        successResponse(res, {
            status: 200,
            message: "All users",
            payload: { users }
        })
    }
    catch (err) {
        next(err);
    }
};

exports.getFacebookUser = async (req, res, next) => {
    try {
        // Retrieve the user by Facebook ID
        const user = await getFacebookUserService(req.params.facebookId);

        successResponse(res, {
            status: 200,
            message: "User returned by facebook id",
            payload: { user }
        })
    }
    catch (err) {
        next(err);
    }
};

exports.getFacebookUserPosts = async (req, res, next) => {
    try {
        const facebookId = req.params.facebookId;

        // Retrieve the user by Facebook ID
        const user = await getFacebookUserService(facebookId);

        // Fetch the user's posts
        const response = await axios.get(
            `https://graph.facebook.com/v20.0/${facebookId}/posts`, {
            params: {
                access_token: user.accessToken,
                fields: 'id,message,created_time,updated_time,link,full_picture,type,from,privacy,attachments',
            }
        });

        const posts = response.data.data;
        const paging = response.data.paging;

        successResponse(res, {
            status: 200,
            message: "Posts returned by Facebook ID",
            payload: { posts, paging }
        });
    } catch (err) {
        next(err);
    }
};

exports.getFacebookUserLikedPages = async (req, res, next) => {
    try {
        const facebookId = req.params.facebookId;

        // Retrieve the user by Facebook ID
        const user = await getFacebookUserService(facebookId);

        // Fetch the user's liked pages
        const response = await axios.get(
            `https://graph.facebook.com/v20.0/${facebookId}/likes`, {
            params: {
                access_token: user.accessToken,
                fields: 'id,name,picture,about,category,fan_count,link',
            }
        }
        );

        const likedPages = response.data.data;
        const paging = response.data.paging;

        successResponse(res, {
            status: 200,
            message: "Liked pages returned by Facebook ID",
            payload: { likedPages, paging }
        });
    } catch (err) {
        next(err);
    }
};
