(function () {
    angular.module("BookWorld")
        .factory("googleBookService", googleBookService);

    function googleBookService($http) {

        var api = {
            "searchBooks": searchBooks,
            "getBookByIsbn": getBookByIsbn,
            "findBookById": findBookById
        };

        return api;

        var apiKey = "AIzaSyD9FmUrQhtzYxjtzej6NYUvOctepNVEvUA";

        function searchBooks(searchQuery) {
            var url = "https://www.googleapis.com/books/v1/volumes?q="+searchQuery+"&key=AIzaSyD9FmUrQhtzYxjtzej6NYUvOctepNVEvUA";
            // var body = {
            //     "requestType": "GET",
            //     "requestURL": "/api/search/?query=\"" + searchQuery + "\"&resources=book"
            // };
            return $http.get(url).then(successCallback, errorCallback);
        }

        function getBookByIsbn(isbn) {
            var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn;
            return $http.get(url).then(successCallback, errorCallback);
        }

        function findBookById(bookId) {
            var url = "https://www.googleapis.com/books/v1/volumes/"+bookId;

            return $http.get(url).then(successCallback, errorCallback);
        }

        // function searchGames(searchQuery) {
        //     var url = "/api/redirectGB";
        //     var body = {
        //         "requestType": "GET",
        //         "requestURL": "/api/search/?query=\"" + searchQuery + "\"&resources=book"
        //     };
        //     return $http.post(url, body).then(successCallback, errorCallback);
        // }
        //
        // function getGameById(gameId) {
        //     var url = "/api/redirectGB";
        //     var body = {
        //         "requestType": "GET",
        //         "requestURL": "/api/book/3030-" + gameId + "/?"
        //     };
        //     return $http.post(url, body).then(successCallback, errorCallback);
        // }
        //
        // function getGameObject(gameData) {
        //     return {
        //         "externalId": gameData.id,
        //         "name": gameData.name,
        //         "description": gameData.deck,
        //         "cover": gameData.image.small_url
        //     }
        // }

        function successCallback(response) {
            return response.data;
        }

        function errorCallback() {
            return null;
        }
    }
})();