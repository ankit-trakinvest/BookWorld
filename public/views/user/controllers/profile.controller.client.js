(function () {
    angular
        .module("BookWorld")
        .controller("profileController", profileController);

    function profileController(userService, $location, sessionUser, $routeParams) {
        var model = this;

        model.username = $routeParams['username'];
        model.loggedUser = sessionUser;
        model.contentType = 'PROFILE';
        model.followed = false;
        model.viewBooks = null;
        model.viewUsers = null;
        model.ownedBooks = null;
        model.likedBooks = null;
        model.followers = null;
        model.following = null;
        model.inventory = null;
        model.isLoggedUser = false;

        model.updateUser = updateUser;
        model.deleteUser = deleteUser;
        model.isActive = isActive;
        model.setContentType = setContentType;
        model.logout = logout;
        model.followUser = followUser;
        model.unFollowUser = unFollowUser;


        function init() {
            if ((!model.username) || (model.username === sessionUser.username)) {
                model.userId = sessionUser._id;
                model.user = sessionUser;
                model.isLoggedUser = true;
            } else {
                userService.findUserByUsername(model.username)
                    .then(function (user) {
                        if (model.loggedUser.isAdmin) {
                            model.contentType = 'PROFILE';
                        } else {
                            model.contentType = 'BOOKS';
                        }
                        model.isLoggedUser = false;
                        model.userId = user._id;
                        model.user = user;
                        if (!model.user.cover) {
                            model.user.cover = "http://www.imran.com/xyper_images/icon-user-default.png";
                        }
                        userService.isFollowing(model.loggedUser._id, model.user._id)
                            .then(function (value) {
                                model.followed = value;
                            });
                        loadUserBooks();
                        model.viewBooks = model.ownedBooks;
                    });
            }
        }

        init();

        function loadUserBooks() {
            userService.getOwnedBooksByUser(model.userId)
                .then(function (books) {
                    model.ownedBooks = books;
                    model.viewBooks = model.ownedBooks;
                });
        }

        function loadLikedBooks() {
            userService.getLikedBooksByUser(model.userId)
                .then(function (books) {
                    model.likedBooks = books;
                    model.viewBooks = model.likedBooks;
                });
        }

        function loadFollowers() {
            userService.getFollowers(model.userId)
                .then(function (users) {
                    model.followers = users;
                    model.viewUsers = model.followers;
                });
        }

        function loadFollowing() {
            userService.getFollowing(model.userId)
                .then(function (users) {
                    model.following = users;
                    model.viewUsers = model.following;
                });
        }

        function loadInventory() {
            userService.getInventoryByUser(model.userId)
                .then(function (users) {
                    model.inventory = users;
                    model.viewBooks = model.inventory;
                });
        }

        function updateUser(user) {
            userService.updateUser(model.userId, user)
                .then(function () {
                });
        }

        function deleteUser(userId) {
            userService.deleteUser(userId)
                .then(function () {
                    $location.url("login/");
                });
        }

        function logout() {
            userService.logout()
                .then(function () {
                    $location.url("login/");
                })
        }

        function setContentType(contentType) {
            model.contentType = contentType;
            switch (contentType) {
                case 'PROFILE':
                    break;
                case 'BOOKS':
                    if (model.ownedBooks === null) {
                        loadUserBooks();
                    } else {
                        model.viewBooks = model.ownedBooks;
                    }
                    break;
                case 'LIKED':
                    if (model.likedBooks === null) {
                        loadLikedBooks();
                    } else {
                        model.viewBooks = model.likedBooks;
                    }
                    break;
                case 'FOLLOWERS':
                    if (model.followers === null) {
                        loadFollowers();
                    } else {
                        model.viewUsers = model.followers;
                    }
                    break;
                case 'FOLLOWING':
                    if (model.following === null) {
                        loadFollowing();
                    } else {
                        model.viewUsers = model.following;
                    }
                    break;
                case 'USERS':
                    loadAllUsers();
                    break;
                case 'INVENTORY':
                    if (model.inventory === null) {
                        loadInventory();
                    } else {
                        model.viewBooks = model.inventory;
                    }
                    break;
            }
        }

        function isActive(contentType) {
            return model.contentType === contentType;
        }

        function followUser(followId) {
            userService.followUser(model.loggedUser._id, followId)
                .then(function () {
                    model.followed = true;
                });
        }

        function unFollowUser(followId) {
            userService.unFollowUser(model.loggedUser._id, followId)
                .then(function () {
                    model.followed = false;
                });
        }

        function isFollowing() {
            userService.isFollowing(model.loggedUser._id, model.user._id)
                .then(function (value) {
                    model.followed = value;
                });
        }

        function loadAllUsers() {
            userService.getUsers()
                .then(function (users) {
                    model.viewUsers = users;
                });
        }
    }
})();