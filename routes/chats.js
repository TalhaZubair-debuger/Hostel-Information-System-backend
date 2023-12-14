const express = require("express");
const isAuth = require("../middlewares/is-auth");
const { body } = require("express-validator")
const chatsController = require("../controllers/chats");

const router = express.Router();

router.post("/add-message", isAuth, chatsController.postAddMessage);

router.get("/get-messages", isAuth, chatsController.getMessages);

router.post("/get-new-messages", isAuth, chatsController.getNewMessages);

router.get("/get-all-messages", isAuth, chatsController.getAllMessages);

module.exports = router