var mongoose = require("mongoose");
var bookSchema = require("./book.schema.server");
mongoose.Promise = require("q").Promise;

var bookModel = mongoose.model("BookModel", bookSchema);

require("../models.server");

bookModel.createBook = createBook;
bookModel.findBookByExternalId = findBookByExternalId;
bookModel.findBookById = findBookById;
bookModel.updateBook = updateBook;
bookModel.deleteBook = deleteBook;
bookModel.addPage = addPage;
bookModel.removePage = removePage;
bookModel.addLike = addLike;
bookModel.removeLike = removeLike;

module.exports = bookModel;

function addPage(bookId, pageId) {
    return bookModel.findById(bookId)
        .then(function (book) {
            book.pages.push(pageId);
            return book.save();
        })
}

function removePage(bookId, pageId) {
    return bookModel.findById(bookId)
        .then(function (book) {
            var index = book.pages.indexOf(pageId);
            book.pages.splice(index, 1);
            return book.save();
        })
}

function addLike(bookId, userId) {
    return bookModel.findById(bookId)
        .then(function (book) {
            book.likes.push(userId);
            return book.save();
        })
}

function removeLike(bookId, userId) {
    return bookModel.findById(bookId)
        .then(function (book) {
            var index = book.pages.indexOf(userId);
            book.likes.splice(index, 1);
            return book.save();
        })
}

function createBook(book) {

    return bookModel.create(book);
}

function findBookById(bookId) {

    return bookModel.findById(bookId);
}

function findBookByExternalId(externalId) {

    return bookModel.findOne({"externalId": externalId});
}

function updateBook(bookId, book) {

    delete book.dateCreated;
    return bookModel.update({_id: bookId}, {$set: book});
}

function deleteBook(bookId) {
   return bookModel.remove({_id: bookId});
}