(function () {
    angular.module("BookWorld").factory("bookService", bookService);

    function bookService($http, googleBookService) {
        var api = {
            "createBook": createBook,
            "findBookByExternalId": findBookByExternalId,
            "isLiked": isLiked,
            "isOwned": isOwned,
            "findBookById": findBookById,
            "updateBook": updateBook,
            "deleteBook": deleteBook,
            "likeBook": likeBook,
            "buyBook": buyBook,
            "unLikeBook": unLikeBook
        };

        var apikey = "AIzaSyD9FmUrQhtzYxjtzej6NYUvOctepNVEvUA";

        return api;

        function createBook(book) {
            var url = "/api/book";

            return $http.post(url, book).then(successCallback, errorCallback);
        }

        function likeBook(userId, bookId) {
            var url = "/api/user/" + userId + "/like/" + bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        function buyBook(userId, bookId) {
            var url = "/api/user/" + userId + "/buy/" + bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        function unLikeBook(userId, bookId) {
            var url = "/api/user/" + userId + "/unlike/" + bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        function isLiked(userId, bookId) {
            var url = "/api/user/" + userId + "/liked/" + bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        function isOwned(userId, bookId) {
            var url = "/api/user/" + userId + "/owned/" + bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        function findBookById(bookId) {
            var url = "/api/book/" + bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        function findBookByExternalId(externalId) {
            var url = "/api/book?externalId=" + externalId;


            return $http.get(url).then(function (response) {
                if (response.status === 204) {
                    return googleBookService.getBookById(externalId)
                        .then(function (bookData) {
                            console.log(googleBookService.getBookObject(bookData));
                            return createBook(googleBookService.getBookObject(bookData))
                        })
                } else {
                    return successCallback(response);
                }
            }, errorCallback);
        }

        function updateBook(bookId, book) {
            var url = "/api/book/" + bookId;

            return $http.put(url, book).then(successCallback, errorCallback);
        }

        function deleteBook(bookId) {
            var url = "/api/book/" + bookId;

            return $http.delete(url).then(successCallback, errorCallback);
        }

        function successCallback(response) {
            return response.data;
        }

        function errorCallback() {
            return null;
        }
    }
})();