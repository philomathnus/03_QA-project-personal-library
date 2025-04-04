/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const {getAllBooks, getBookById, createBook, updateBook, deleteBook, deleteAllBooks} = require('../controllers/bookController');

module.exports = function (app) {

  app.route('/api/books')
    .get(getAllBooks)
    .post(createBook)
    .delete(deleteAllBooks);

  app.route('/api/books/:id')
    .get(getBookById)  
    .post(updateBook)
    .delete(deleteBook);
  
};
