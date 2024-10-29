const router = require("express").Router();
const {
    facebookLogin,
    emailLogin,
    emailSignUp,
    getFacebookUsers,
    getFacebookUser,
    getFacebookUserPosts,
    getFacebookUserLikedPages,
    adminEmailSignUp
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/facebook-login", facebookLogin);
router.post("/email-login", emailLogin);
router.post("/email-signup", emailSignUp);
router.post("/admin-email-signup", adminEmailSignUp);

router.get("/facebook-users", verifyToken, getFacebookUsers);
router.get("/facebook-users/:facebookId", verifyToken, getFacebookUser);
router.get("/facebook-users/posts/:facebookId", verifyToken, getFacebookUserPosts);
router.get("/facebook-users/likes/:facebookId", verifyToken, getFacebookUserLikedPages);

module.exports = router;