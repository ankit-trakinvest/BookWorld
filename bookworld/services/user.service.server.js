var app = require("../../express");

var userModel = require("../model/user/user.model.server");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
var bcrypt = require("bcrypt-nodejs");

app.post("/api/user", createUser);
app.get("/api/user", findUserByUsername);
app.get("/api/searchUsers", searchUsers);
app.get("/api/users", getAllUsers);
app.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
app.post("/api/login", passport.authenticate('local'), login);
app.get("/api/logout", logout);
app.get("/api/checkLogin", checkLogin);
app.get("/api/user/:userId", findUserById);
app.put("/api/user/:userId", updateUser);
app.delete("/api/user/:userId", deleteUser);

app.get("/api/user/:userId/liked", findLikedBooksByUser);
app.get("/api/user/:userId/liked/:bookId", isLiked);
app.get("/api/user/:userId/owned", findOwnedBooksByUser);

app.get("/api/user/:userId/inventory", getInventoryByUser);
app.delete("/api/user/:userId/inventory/:bookId", removeInventory);
app.post("/api/user/:userId/inventory", upsertInventory);


app.get("/api/user/:userId/owned/:bookId", isOwned);
app.get("/api/user/:userId/following", getFollowing);
app.get("/api/user/:userId/following/:userId2", isFollowing);
app.get("/api/user/:userId/followers", getFollowers);
app.get("/api/user/:userId/followers/:userId2", isFollower);

app.get("/api/user/:userId/buy/:bookId", buyBook);
app.get("/api/user/:userId/like/:bookId", likeBook);
app.get("/api/user/:userId/unlike/:bookId", unLikeBook);
app.get("/api/user/:userId/follow/:userId2", followUser);
app.get("/api/user/:userId/unfollow/:userId2", unFollowUser);
app.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/#!/profile',
    failureRedirect: '/#!/login'
}));
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#/user',
    failureRedirect: '/#/login'
}));

var googleConfig = {
    clientID: '213882228271-fh8iirj8cpem0d1bf6c8qcrt1rq2cc2t.apps.googleusercontent.com',
    clientSecret: 'z1MDwNR38SY-qsru261Jisuj',
    callbackURL: 'http://127.0.0.1:3030/google/callback'
};

var facebookConfig = {
    clientID: '895947820560957',
    clientSecret: 'dee6a2e891852a75a9bc5027cd695710',
    callbackURL: 'http://127.0.0.1:3030/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'name', 'picture.type(large)']
};

if (process.env.GOOGLE_CLIENT_ID) {
    googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };
}

if (process.env.FACEBOOK_CLIENT_ID) {
    facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'email', 'name', 'picture.type(large)']
    };
}

passport.use(new LocalStrategy(localStrategy));
passport.use(new GoogleStrategy(googleConfig, googleStrategy));
passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

function createUser(request, response) {
    var user = request.body;
    user.password = bcrypt.hashSync(user.password);
    userModel.createUser(user)
        .then(function (newUser) {
            response.send(newUser);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function googleStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByGoogleId(profile.id)
        .then(
            function (user) {
                if (user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        username: emailParts[0],
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        cover: profile.photos[0].value,
                        email: email,
                        google: {
                            id: profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newGoogleUser);
                }
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            }
        )
        .then(
            function (user) {
                return done(null, user);
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            }
        );
}

function facebookStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByFacebookId(profile.id)
        .then(function (user) {
                if (user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        email: email,
                        username: emailParts[0],
                        cover: profile.photos[0].value,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newGoogleUser);
                }
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            })
        .then(function (user) {
                return done(null, user);
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            });
}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function (user) {
                done(null, user);
            },
            function (err) {
                done(err, null);
            }
        );
}

function localStrategy(username, password, done) {
    userModel.findUserByUsername(username)
        .then(function (user) {
            if (user && bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }, function (error) {
            if (error) {
                return done(error);
            }
        });
}

function login(request, response) {
    var user = request.user;
    response.json(user);
}

function logout(request, response) {
    request.logOut();
    response.send(200);
}

function checkLogin(request, response) {
    response.send(request.isAuthenticated() ? request.user : '0');
}

function findUserByUsername(request, response) {
    var username = request.query.username;
    userModel.findUserByUsername(username)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function findUserById(request, response) {
    var userId = request.params.userId;
    userModel.findUserById(userId)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function updateUser(request, response) {
    var user = request.body;
    var userId = request.params.userId;
    userModel.updateUser(userId, user)
        .then(function () {
            response.sendStatus(200);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function deleteUser(request, response) {
    var userId = request.params.userId;

    userModel.deleteUser(userId)
        .then(function () {
            response.sendStatus(200);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function findOwnedBooksByUser(request, response) {
    var userId = request.params.userId;

    userModel.findUserById(userId).populate("books")
        .exec()
        .then(function (user) {
            response.json(user.books);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function getInventoryByUser(request, response) {
    var userId = request.params.userId;

    userModel.findUserById(userId).populate('inventory._book')
        .exec()
        .then(function (user) {
            response.json(user.inventory);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function findLikedBooksByUser(request, response) {
    var userId = request.params.userId;

    userModel.findUserById(userId).populate("liked")
        .exec()
        .then(function (user) {
            response.json(user.liked);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function getFollowing(request, response) {
    var userId = request.params.userId;

    userModel.findUserById(userId).populate("following")
        .exec()
        .then(function (user) {
            response.json(user.following);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function isFollowing(request, response) {
    var userId = request.params.userId;
    var userId2 = request.params.userId2;

    userModel.findUserById(userId)
        .then(function (user) {
            if (user.following.indexOf(userId2) >= 0) {
                response.send(true);
            } else {
                response.send(false);
            }
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function isFollower(request, response) {
    var userId = request.params.userId;
    var userId2 = request.params.userId2;

    userModel.findUserById(userId)
        .then(function (user) {
            if (user.followers.indexOf(userId2) >= 0) {
                response.send(true);
            } else {
                response.send(false);
            }
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function isLiked(request, response) {
    var userId = request.params.userId;
    var bookId = request.params.bookId;

    userModel.findUserById(userId)
        .then(function (user) {
            if (user.liked.indexOf(bookId) >= 0) {
                response.send(true);
            } else {
                response.send(false);
            }
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function isOwned(request, response) {
    var userId = request.params.userId;
    var bookId = request.params.bookId;

    userModel.findUserById(userId)
        .then(function (user) {
            if (user.books.indexOf(bookId) >= 0) {
                response.send(true);
            } else {
                response.send(false);
            }
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function likeBook(request, response) {
    var userId = request.params.userId;
    var bookId = request.params.bookId;

    userModel.addLike(userId, bookId)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function buyBook(request, response) {
    var userId = request.params.userId;
    var bookId = request.params.bookId;

    userModel.addBook(userId, bookId)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function unLikeBook(request, response) {
    var userId = request.params.userId;
    var bookId = request.params.bookId;

    userModel.removeLike(userId, bookId)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function getFollowers(request, response) {
    var userId = request.params.userId;

    userModel.findUserById(userId).populate("followers")
        .exec()
        .then(function (user) {
            response.json(user.followers);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function followUser(request, response) {
    var userId = request.params.userId;
    var userId2 = request.params.userId2;

    userModel.addFollow(userId, userId2)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function unFollowUser(request, response) {
    var userId = request.params.userId;
    var userId2 = request.params.userId2;

    userModel.removeFollow(userId, userId2)
        .then(function (user) {
            response.send(user);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function getAllUsers(request, response) {
    userModel.getAllUsers()
        .then(function (users) {
            response.send(users);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function searchUsers(request, response) {
    var searchTerm = request.query.searchTerm;
    userModel.searchUsers(searchTerm)
        .then(function (users) {
            response.send(users);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function removeInventory(request, response) {
    var userId = request.params.userId;
    var bookId = request.params.bookId;

    return userModel.removeInventory(userId, bookId)
        .then(function () {
            response.sendStatus(200);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}

function upsertInventory(request, response) {
    var userId = request.params.userId;
    var inventory = request.body;

    userModel.upsertInventory(userId, inventory)
        .then(function (users) {
            response.send(users);
        }, function (error) {
            response.sendStatus(404).error(error);
        });
}