const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    offlinePaymentSent: {
        type: Boolean,
        required: false
    },
    offlinePaymentRecieved: {
        type: Boolean,
        required: false
    },
    occupantId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null
    }

})

module.exports = mongoose.model("BedRecord", bedRecordSchema);