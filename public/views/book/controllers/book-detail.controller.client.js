/**
 * Created by harsh on 8/21/2017.
 */
(function () {
    angular
        .module("BookWorld")
        .controller("bookDetailController", bookDetailController);

    function bookDetailController($routeParams, bookService, googleBookService, $location, sessionUser) {
        var model = this;

        model.bookId = $routeParams["bookId"];
        model.liked = false;
        model.owned = false;

        model.loggedUser = sessionUser;
        model.isAnon = true;
        model.isSelling = false;

        // model.getBookURL = getBookURL;
        // model.likeBook = likeBook;
        // model.unLikeBook = unLikeBook;
        // model.buyBook = buyBook;
        // model.sellBook = sellBook;

        function init() {
            if (sessionUser) {
                model.userId = sessionUser._id;
                model.isAnon = false;
            }

            bookService.findBookById(model.bookId)
                .then(function (book) {
                    if(book){
                        model.bookInfo = book;
                    }
                    else {
                        googleBookService.findBookById(model.bookId)
                            .then(function (bookData) {
                                model.bookInfo = bookData.volumeInfo;
                                console.log(bookData.volumeInfo);
                            });
                    }
                });

            // if (!model.isAnon) {
            //     bookService.isLiked(model.userId, model.bookId)
            //         .then(function (value) {
            //             model.liked = value;
            //         });
            //
            //     bookService.isOwned(model.userId, model.bookId)
            //         .then(function (value) {
            //             model.owned = value;
            //         });
            // }
        }

        init();

        // function getBookURL(externalId) {
        //     bookService.findBookByExternalId(externalId)
        //         .then(function (book) {
        //             $location.url("/book/" + book._id + "/detail");
        //         });
        // }
        //
        // function likeBook() {
        //     if (model.isAnon) {
        //         $location.url("login");
        //     } else {
        //         bookService.likeBook(model.userId, model.bookId)
        //             .then(function (book) {
        //                 model.liked = !model.liked;
        //             });
        //     }
        // }
        //
        // function buyBook() {
        //     if (model.isAnon) {
        //         $location.url("login");
        //     } else {
        //         bookService.buyBook(model.userId, model.bookId)
        //             .then(function (book) {
        //                 model.owned = true;
        //             });
        //     }
        // }
        //
        // function sellBook() {
        //     $location.url("/book/" + model.bookId + "/manage");
        // }
        //
        // function unLikeBook() {
        //     if (model.isAnon) {
        //         $location.url("login");
        //     } else {
        //         bookService.unLikeBook(model.userId, model.bookId)
        //             .then(function (book) {
        //                 model.liked = !model.liked;
        //             });
        //     }
        // }
    }
})();