const Chats = require("../models/chats");

exports.postAddMessage = async (req, res, next) => {
    const userId = req.query.userId;
    const ownerId = req.query.ownerId;
    const message = req.body.message;

    console.log(ownerId + " " + userId);
    try {
        const messagesCheck = await Chats.findOne({ userId, ownerId });
        if (messagesCheck) {
            messagesCheck.messages.push({
                message: message,
                senderId: req.userId
            });
            await messagesCheck.save();
        }
        else {
            const messageResponse = new Chats({
                userId,
                ownerId
            })
            messageResponse.messages.push(message);
            await messageResponse.save();
        }

        const messages = await Chats.findOne({ userId, ownerId });

        if (messages) {
            res.status(200).json({ messages: messages, current: req.userId });
        }
        else {
            res.status(400).json({ message: "Unknown Error occurred!" });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getMessages = async (req, res, next) => {
    const userId = req.query.userId;
    const ownerId = req.query.ownerId;

    try {
        const messages = await Chats.findOne({ userId, ownerId });
        if (!messages) {
            console.log("Damn it!");
            res.status(404).json({ message: "No messages found!" });
        }
        else {
            res.status(200).json({ messages: messages, current: req.userId });
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getNewMessages = async (req, res, next) => {
    const userId = req.query.userId;
    const ownerId = req.query.ownerId;
    const chatLength = req.body.chatLength;
    try {
        const messages = await Chats.findOne({ userId, ownerId });
        if (!messages) {
            const error = new Error("Error getting messages");
            throw error;
        }
        if (messages.messages.length !== chatLength) {
            res.status(200).json({ messages: messages, current: req.userId });
        } else {
            res.status(200).json({ message: "No new messsage!" });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getMessages = async (req, res, next) => {
    const userId = req.userId;

    try {
        const messages = await Chats.findOne({ userId });
        if (messages) {
            res.status(200).json({ messages: messages, current: req.userId });
        }
        else {
            res.status(404).json({ message: "No messages found!" });
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAllMessages = async (req, res, next) => {
    const user = req.userId;

    try {
        const messages = await Chats.find({ userId: user });
        if (messages.length === 0) {
            const ownerMessages = await Chats.find({ ownerId: user });
            if (ownerMessages.length === 0) {
                res.status(404).json({ message: "No Messages Found!" });
            } else {
                res.status(200).json({ messages: ownerMessages, current: user });
            }
        } else {
            res.status(200).json({ messages: messages, current: user });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
