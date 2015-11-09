define([
    'backbone',
    'text!templates/TVShowView.html',
    'helper/util'
], function (Backbone, TVShowTemplate, Util) {

    console.log("TVShow: defined");

    var TVShowView = Backbone.View.extend({
        template: _.template(TVShowTemplate),
        el: ".page",
        initialize: function () {
            this.render();
        },
        render: function () {
            var modelJSON = this.model.toJSON();
            var youtubeVideo = this.findYoutubeVideo(modelJSON.artistName + 'trailer');
            this.$el.html(this.template({
                mod: modelJSON,
                episodes: this.collection.toJSON(),
                youtubeVideoId: youtubeVideo,
                resizer: Util
            }));
        },
        findYoutubeVideo: function (keyword) {
            var url = 'https://www.googleapis.com/youtube/v3/search?part=id&q=' + keyword + '&type=video&key=AIzaSyA2Sh1KhOUfKYpfQchT5oZPgO0PpTqB17M';
            var videos = undefined;
            $.ajaxSetup({
                async: false
            });
            $.getJSON(url, function (data) {
                videos = data;
            });
            $.ajaxSetup({
                async: true
            });
            return videos.items[0].id.videoId;
        }
    });

    return TVShowView;
});