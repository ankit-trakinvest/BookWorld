var app = require("../../express");

var bookModel = require("../model/book/book.model.server");

app.post("/api/book", createBook);
app.get("/api/book/:bookId", findBookById);
app.get("/api/book", findBookByExternalId);
app.put("/api/book/:bookId", updateBook);
app.delete("/api/book/:bookId", deleteBook);

function createBook(request, response) {
    var book = request.body;

    bookModel.createBook(book)
        .then(function (newBook) {
            response.send(newBook);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function findBookById(request, response) {
    var bookId = request.params.bookId;

    bookModel.findBookById(bookId)
        .then(function (book) {
            response.send(book);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function updateBook(request, response) {
    var book = request.body;
    var bookId = request.params.bookId;

    bookModel.updateBook(bookId, book)
        .then(function () {
            response.sendStatus(200);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function deleteBook(request, response) {
    var bookId = request.params.bookId;

    bookModel.deleteBook(bookId)
        .then(function () {
            response.sendStatus(200);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function findBookByExternalId(request, response) {
    var externalId = request.query.externalId;

    bookModel.findBookByExternalId(externalId)
        .then(function (book) {
            if (book === null) {
                response.sendStatus(204);
            } else {
                response.json(book);
            }
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}