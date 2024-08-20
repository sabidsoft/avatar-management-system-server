const router = require("express").Router();
const {
    facebookLogin,
    getUsers,
    getUser,
    getUserPosts
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUsers);
router.get("/:facebookId", verifyToken, getUser);
router.get("/posts/:facebookId", verifyToken, getUserPosts);
router.post("/", facebookLogin);

module.exports = router;