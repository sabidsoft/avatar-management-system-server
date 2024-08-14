const router = require("express").Router();
const { facebookLogin, getUsers, getUser } = require("../controllers/user.controller");

router.get("/", getUsers);
router.get("/:facebookId", getUser);
router.post("/", facebookLogin);

module.exports = router;