define(['backbone', 'models/userModel', 'text!templates/UserView.html', 'jquery.cookie'], function (Backbone, userModel,Template) {

    var UserView = Backbone.View.extend({
        template: _.template(Template),
        el: ".page",
        events: {
            "click .btnAddFriend": "addFriend",
            "click .btn-removeFriend": "removeFriend",
            "click .btn-GotoFriendPage": "goToFriendPage",
            "click .btn-danger": "deleteWatchlist",
            "click .remove": "removeMovie",
            "click .btn-success": "addWatchlist",
            "click .modify": "modifyWatchlist"

        },
        initialize: function (user, watchlists,loggedUser) {
            console.log("UserView initializing...");
            _.bindAll(this, 'render');
            this.user = user;
            this.watchlists = watchlists;
            this.loggedUser = loggedUser;

            this.user.on('change', this.render);
            //this.watchlists.on('change', this.render);

            var self = this;
            this.user.bind('sync add remove update', function () {
                self.render();
            });
            this.watchlists.bind('sync add remove update', function () {
                self.render();
            });

            this.render();

            console.log($.cookie('token'));


            this.showHideUserButtons();
        },
        render: function () {

            this.$el.html(this.template({
                mod: this.user.toJSON(),
                watchlists: this.watchlists.toJSON()
            }));
            this.showHideUserButtons();
        },
        addFriend: function (event) {

           // debugger;
            var userJson = this.user.toJSON();
            var userId = userJson.id;
            console.log("enter");
            var self=this;
                $.ajax({
                    type: "POST",
                    url: "follow",
                    contentType: "application/x-www-form-urlencoded",
                    data: {id: userId}
                }).done( function(data) {
                    //console.log(self.user.toJSON);
                    //self.loggedUser.fetch();
                   // console.log(self.user.toJSON);
                    }).fail(function (XMLHttpRequest) {
                        console.log("Something went wrong while adding a new friend.");
                    })



        },
        removeFriend: function (event) {
            debugger;
            var self=this;
            var friendId = event.target.id;
            //console.log(friendId);
            var self=this;

            $.ajax({
                type: "DELETE",
                url: "follow/"+friendId,
                contentType: "application/x-www-form-urlencoded"
            }).done( function(data) {
               self.user.fetch();
                }).fail(function (XMLHttpRequest) {
                    console.log("Something went wrong while removing a friend.");
                })

           // alert(1);
        },

        goToFriendPage: function(event){
            var friendId = event.target.id;
          // console.log("getting to friend page");
            Backbone.history.navigate('users/'+friendId, {trigger: true});
        },

        showHideUserButtons: function() {

            var pageUser= this.user.toJSON();
            var pageUserid= pageUser.id;


            if ($.cookie("userPublicInfo")) {
                var remote_auth_token = "";
                var userPublicInfo = JSON.parse($.cookie("userPublicInfo"));
                var loggedUserId = userPublicInfo.id;
               // console.log(loggedUserId);

            }

            //hide or show remove friend button if page is logged user page
            //remove buttons to modify wathclists if the page is not le logged user's page
            if (loggedUserId !== pageUserid){
               // console.log(true);

                this.$el.find('.btn-lg1').addClass('hidden');

                //button wacthlist

                this.$el.find('.btn-danger').addClass('hidden');
                this.$el.find('.btn-success').addClass('hidden');
                this.$el.find('.modify').addClass('hidden');
                this.$el.find('.remove').addClass('hidden');

            }
            else{

                this.$el.find('.btn-lg2').addClass('hidden');
                this.$el.find('.btnAddFriend').addClass('hidden');

            }


        },

        deleteWatchlist: function () {
            var targetID = event.target.id;
            var self=this;
            $.ajax({
                type: "DELETE",
                url: "watchlists/"+targetID
            }).done( function(data) {
                self.watchlists.fetch();
                console.log("watchlist removed.");
            }).fail(function (XMLHttpRequest) {
                console.log("Something went wrong while removing a watchlist.");
            })
        },
        removeMovie: function (event) {
            var data = $.parseJSON($(event.target).attr('data-button'));
            var watchlistID = data.watchlistId;
            var trackId = data.trackId;
            var self=this;
            $.ajax({
                type: "DELETE",
                url: "watchlists/"+watchlistID+"/movies/"+trackId
            }).done( function(data) {
                self.watchlists.fetch();
                console.log("Movie removed from watchlist.");
            }).fail(function (XMLHttpRequest) {
                console.log("Something went wrong while removing a movie from a watchlist.");
            })
        },
        addWatchlist: function (event) {
/*
            var isValid = this.watchlists.create({
                "name": $("#textArea").val()
            }, {
                type: 'POST',
                validate: true
            });*/

            var self=this;
            var watchlistName = $("#textArea").val();
            $.ajax({
                type: "POST",
                url: "watchlists",
                contentType: "application/x-www-form-urlencoded",
                data: {name: watchlistName}
            }).done( function(data) {
                self.watchlists.fetch();
                console.log("New watchlist added.");
            }).fail(function (XMLHttpRequest) {
                console.log("Something went wrong while adding a new watchlist.");
            })



        },
        modifyWatchlist: function (event) {
            var self = this;
            var watchlistID = $(event.target).attr('data-button');
            var newName = $('#name' + watchlistID).val();

            $.ajax({
                type: "PUT",
                url: "watchlists/"+watchlistID,
                contentType: "application/x-www-form-urlencoded",
                data: {name: newName}
            }).done( function(data) {
                self.watchlists.fetch();
                console.log("Watchlist name changed.");
            }).fail(function (XMLHttpRequest) {
                console.log("Something went wrong while changing watchlist's name.");
            })

        }



    });

    return UserView;
});
/**
 * Created by user on 2015-12-08.
 */
