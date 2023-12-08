const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Beds = Schema({
    hosteliteName: String,
    contact: String,
    rentAmont: Number,
    dueDate: String,
    previousDues: String,
    preOccupied: Boolean,
    occupied: Boolean
})

const bedRecordSchema = Schema({
    hostelId: {
        type: Schema.Types.ObjectId,
        ref: "Hostel",
        required: true
    },
    hosteliteName: {
        type: String,
        required: false
    },
    contact: {
        type: String,
        required: false
    },
    rentAmont: {
        type: String,
        required: false
    },
    dueDate: {
        type: String,
        required: false
    },
    previousDues: {
        type: String,
        required: false
    },
    preOccupied: {
        type: Boolean,
        required: true
    },
    occupied: {
        type: Boolean,
        required: true
    },
    occupantId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null
    }

})

module.exports = mongoose.model("BedRecord", bedRecordSchema);