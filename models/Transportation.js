const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransportationSchema = new Schema({
    type: {
        type: String,
        // accm = accomodation, taxi = transportation
        enum: ['CAR', 'VAN', 'TRUCK', 'JEEP', 'SUV'],
        required: true
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    seats: {
        type: Number,
        default: 1
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    driver: {
        type: Boolean,
        default: false
    },
    driverContact: {
        type: [Number],
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = Transportation = mongoose.model("Transportation", TransportationSchema);
