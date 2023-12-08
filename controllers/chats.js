const Chats = require("../models/chats");

exports.postAddMessage = async (req, res, next) => {
    const userId = req.userId;
    const ownerId = req.body.ownerId;
    const message = req.body.message;

    try {
        const messagesCheck = await Chats.findOne({ userId, ownerId });
        if (messagesCheck) {
            messagesCheck.messages.push(message);
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
            res.status(200).json({ messages: messages.messages, current: req.userId });
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
    const userId = req.userId;
    const ownerId = req.params.ownerId;

    try {
        const messages = await Chats.findOne({ userId, ownerId });
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

exports.getNewMessages = async (req, res, next) => {
    const userId = req.userId;
    const ownerId = req.params.ownerId;
    const chatLength = req.body.chatLength;
    try {
        const messages = await Chats.findOne({ userId, ownerId });
        if (!messages) {
            const error = new Error("Error getting messages");
            throw error;
        }
        if (messages.messages.length !== chatLength) {
            res.status(200).json({ messages: messages });
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
