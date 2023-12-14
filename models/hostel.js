const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hostelSchema = Schema({
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    roomSize: {
        type: String,
        required: true
    },
    bedsInRoom: {
        type: Number,
        required: true
    },
    totalBeds: {
        type: Number,
        required: true
    },
    occupiedBeds: {
        type: Number,
        required: true
    },
    vacantBeds: {
        type: Number,
        required: true
    },
    facilities: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    publishableKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    reviews: {
        type: Array,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("Hostel", hostelSchema);