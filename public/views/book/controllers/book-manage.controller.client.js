(function () {
    angular
        .module("BookWorld")
        .controller("bookManageController", bookManageController);

    function bookManageController($routeParams, bookService, $location, sessionUser, userService) {
        var model = this;
        model.updateListing = updateListing;
        model.deleteListing = deleteListing;
        model.userId = sessionUser._id;
        model.bookId = $routeParams["bookId"];
        model.loggedUser = sessionUser;
        model.inventory = null;

        function init() {
            userService.getInventoryByUser(model.userId)
                .then(function (listings) {
                    model.listings = listings;
                    for (var i = 0; i < model.listings.length; i++) {
                        if (model.listings[i]._book._id === model.bookId) {
                            model.inventory = angular.copy(model.listings[i]);
                            model.inventory.name = model.listings[i]._book.name;
                            model.inventory._book = model.bookId;
                            break;
                        }
                    }
                    if (model.inventory === null) {
                        bookService.findBookById(model.bookId)
                            .then(function (book) {
                                model.book = book;
                                model.inventory = {};
                                model.inventory._book = model.bookId;
                                model.inventory.name = book.name;
                                model.inventory.price = 0;
                                model.inventory.quantity = 0;
                            });
                    }
                });


        }

        init();

        function updateListing(inventory) {
            userService.upsertInventory(model.userId, inventory)
                .then(function () {
                    $location.url("/profile");
                });
        }

        function deleteListing() {
            userService.removeInventory(model.userId, model.bookId)
                .then(function () {
                    $location.url("/profile");
                });
        }
    }
})();
