const book = require('../models/book');
const BookModel = require('../models/book');

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

exports.getAllBooks = async () => {
    let allBooks = await BookModel.find();
    return allBooks.map((book) => ({
        ...book._doc,
        commentcount: book.comments.length
    }));
};

exports.getBookById = async (id) => {
    return await BookModel.findById(id);
};

exports.createBook = async (bookWithTitleOnly) => {
    const uuid = generateUUID();
    const book = {
        ...bookWithTitleOnly,
        _id: uuid,
        comments: []
    }
    return await BookModel.create(book);
};

exports.updateBook = async (orgBook, commentObj) => {
    let comments = orgBook.comments;
    comments.push(commentObj.comment);
    orgBook.comments = comments;
    return await BookModel.findByIdAndUpdate(orgBook._id, orgBook, { lean: true, new: true });
};


exports.deleteBook = async (id) => {
    return await BookModel.findByIdAndDelete(id);
};

exports.deleteAllBooks = async () => {
    return await BookModel.deleteMany({});
};
