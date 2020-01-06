const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccommodationSchema = new Schema({
    type: {
        type: String,
        // accm = accomodation, taxi = transportation
        enum: ['HOTEL', 'MODEL', 'INN', 'HOSTEL', 'BNB'],
        required: true
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    capacity: {
        type: Number,
        default: 1
    },
    address: {
        city: String,
        street: String,
        houseNumber: String,
        required: true
    },
    tel: {
        type: [Number],
        required: true
    },
    available: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = Accommodation = mongoose.model("Accommodation", AccommodationSchema);
