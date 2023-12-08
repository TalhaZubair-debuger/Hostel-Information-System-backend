const express = require("express");
const isAuth = require("../middlewares/is-auth");
const { body } = require("express-validator")
const chatsController = require("../controllers/chats");

const router = express.Router();

router.post("/add-message", isAuth, chatsController.postAddMessage);

router.get("/get-messages/:ownerId", isAuth, chatsController.getMessages);

router.get("/get-all-messages", isAuth);

router.post("/get-new-messages/:ownerId", isAuth, chatsController.getNewMessages);

module.exports = router