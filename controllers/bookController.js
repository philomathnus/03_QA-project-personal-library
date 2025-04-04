const bookService = require('../services/bookService');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (book) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      res.json(book);
    } else {
      res.send('no book exists');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    if (req.body.title) {
      const book = await bookService.createBook(req.body);
      //response will contain new book object including atleast _id and title
      res.json(book);
    } else {
      res.send('missing required field title');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    if (req.body.comment && req.body.comment !== '') {
      const orgBook = await bookService.getBookById(req.params.id);
      if (orgBook) {
        const updatedBook = await bookService.updateBook(orgBook, req.body);
        res.json(updatedBook);
      } else {
        res.send('no book exists');
      }
    } else {
      res.send('missing required field comment');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await bookService.deleteBook(req.params.id);
    if (deletedBook) {
      res.send('delete successful');
    } else {
      res.send('no book exists');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllBooks = async (req, res) => {
  try {
    await bookService.deleteAllBooks();
    res.send('complete delete successful');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
