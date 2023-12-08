const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    favorites: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model("User", userSchema);