const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        default: null
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        default: null
    },
    messages: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model("Chat", chatSchema);