(function () {
    angular
        .module("BookWorld")
        .controller("searchController", searchController);

    function searchController($location, $routeParams, googleBookService, sessionUser, userService, bookService) {
        var model = this;
        model.searchBooks = searchBooks;
        model.getBookURL = getBookURL;
        model.searchTerm = $routeParams["q"];
        model.loggedUser = sessionUser;


        function init() {
            searchBooks();
        }

        init();

        function searchBooks() {
            googleBookService.searchBooks(model.searchTerm)
                .then(function (response) {
                    model.searchResult = response.items;
                });
            userService.searchUsers(model.searchTerm)
                .then(function (users) {
                    model.searchResultUsers = users;
                });
        }

        function getBookURL(externalId) {
            bookService.findBookByExternalId(externalId)
                .then(function (book) {
                    $location.url("/book/" + book._id + "/detail");
                });
        }
    }
})();