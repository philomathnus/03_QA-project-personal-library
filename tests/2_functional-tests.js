/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/book');
const { default: mongoose } = require('mongoose');

chai.use(chaiHttp);

const books = [
  new Book({ _id: 'id1', title: 'First Book', comments: ['first and only comment'] }),
  new Book({ _id: 'id2', title: 'Second Book', comments: ['first comment', 'second comment'] }),
  new Book({ _id: 'id3', title: 'Third Book', comments: [] })
];

suite('Functional Tests', function () {

  suite('Routing tests', function () {

    beforeEach((done) => {
      Book.deleteMany({})
        .then(() => {
          Book.insertMany(books)
            .then(() => {
              done();
            })
            .catch(err => console.log(err));;
        })
        .catch(err => console.log(err));


      /*       let promises = []
            books.forEach(book => {
              const bookPromise = Promise.resolve(book.save());
              promises.push(bookPromise);
            });
            Promise.all(promises).then(() => done()); */
    });


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        const bookTitle = 'new book';
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({
            title: bookTitle
          })
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.property(res.body, '_id', 'Books in array should contain _id');
              assert.property(res.body, 'title', 'Books in array should contain title');
              assert.equal(res.body.title, bookTitle);
            }
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .type('form')
          .send({})
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field title');
            }
            done();
          });
      });

    });

    suite('DELETE /api/books => delete all books from library', function () {
      test('DELETE /api/books => successful delete all books from librar', function (done) {
        chai.request(server)
        .delete('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'complete delete successful');
          done();
        });
      });
    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'response should be an array');
              assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
              assert.property(res.body[0], 'title', 'Books in array should contain title');
              assert.property(res.body[0], '_id', 'Books in array should contain _id');
            }
            done();
          });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/notfound')
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
            }
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        const expected = books.filter(book => book._id === 'id1')[0];
        chai.request(server)
          .get('/api/books/id1')
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, expected._id);
              assert.equal(res.body.title, expected.title);
              assert.deepEqual(res.body.comments, expected.comments);
            }
            done();
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        const commentText = 'This is a new comment'
        const expected = books.filter(book => book._id === 'id1')[0];
        expected.comments.push(commentText);
        chai.request(server)
          .post('/api/books/id1')
          .type('form')
          .send({
            comment: commentText
          })
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, expected._id);
              assert.equal(res.body.title, expected.title);
              assert.deepEqual(res.body.comments, expected.comments);
            }
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/id1')
          .type('form')
          .send({})
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field comment');
            }
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/notfound')
          .type('form')
          .send({
            comment: 'does not matter, book not found'
          })
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
            }
            done();
          });
      });

    });


    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/id1')
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              done();
            }
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/notfound')
          .end((err, res) => {
            if (res.error) {
              console.log(res.error);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            }
          });
      });

    });


  });
});
