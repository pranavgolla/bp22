const mongoose = require('mongoose');

const aadhaarSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    aadhaarFile: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
});

const Aadhaar = mongoose.model('Aadhaar', aadhaarSchema);
module.exports = Aadhaar;
