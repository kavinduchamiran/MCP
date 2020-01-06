const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
        required: true
    },
    birthday: {
        year: Number,
        month: Number,
        day: Number
    },
    nationality: {
        type: String,
        enum: ['US', 'EU', 'LK'],
        required: true
    },
    languages: [{
        name: {
            type: String,
            enum: ['EN', 'SI', 'TA', 'FR']
        },
        level: {
            type: String,
            enum: ['FLUENT', 'NATIVE', 'INTERMEDIATE']
        },
        _id: false
        // required: true
    }],
    type: {
        type: String,
        enum: ['BUYER', 'SELLER'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    socialMediaId: {
        type: String,
    },
    socialMediaType: {
        type: String,
        enum: ['FB', 'GOOGLE']
    },
    password: {
        type: String,
    },
    socialMediaToken: {
        type: String,
    },
    pushToken: {
        type: String
    },
    activated: {
        type: Boolean,
        default: false
    },
    dateDeleted: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        default: 5
    }
});

module.exports = User = mongoose.model("User", UserSchema);
