const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        index: true
    },
});

module.exports = mongoose.model('document', appSchema);