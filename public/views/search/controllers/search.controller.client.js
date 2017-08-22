(function () {
    angular
        .module("BookWorld")
        .controller("searchController", searchController);

    function searchController($location, $routeParams, googleBookService, sessionUser, userService) {
        var model = this;
        model.searchGames = searchGames;
        model.getBookURL = getBookURL;
        model.searchTerm = $routeParams["q"];
        model.loggedUser = sessionUser;


        function init() {
            searchGames();
        }

        init();

        function searchGames() {
            googleBookService.searchBooks(model.searchTerm)
                .then(function (response) {
                    console.log(response);
                    model.searchResult = response.items;
                });
            userService.searchUsers(model.searchTerm)
                .then(function (users) {
                    model.searchResultUsers = users;
                });
        }

        function getBookURL(externalId) {
            googleBookService.findBookByExternalId(externalId)
                .then(function (game) {
                    $location.url("/book/" + game._id + "/detail");
                });
        }
    }
})();