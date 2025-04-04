const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        comments: [String]
    },
    {
        collection: 'books'
    });

module.exports = mongoose.model("Book", bookSchema);
