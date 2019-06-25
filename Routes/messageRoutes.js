const express = require("express");

const router = express.Router();

const MessageCtrl = require('../Controllers/Message');
const AuthHelper = require("../Helpers/AuthHelper");

router.post("/chat-messages/:senderId/:receiverId", AuthHelper.VerifyToken, MessageCtrl.SendMessage);

module.exports = router;
