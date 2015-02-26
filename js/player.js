;
(function(exports) {

    Backbone.PlayerRouter = Backbone.Router.extend({
        initialize: function() {
            this.el = document.querySelector('.main');
            Backbone.history.start();
        },
        routes: {
            '*default': 'home'
        },
        home: function() {
            var self = this;
            this.current = new Backbone.TrackModel({url: 'https://soundcloud.com/magnusvaltias/a-b-c-ya-later'});
            // SC.get('/resolve', {url: 'https://soundcloud.com/magnusvaltias/a-b-c-ya-later'},
            // 	function(data) {
            // 		console.log(data);
            //     track = data;
            // });

            // SC.stream('/tracks/184234896', function(data) {
            //     React.render( d(playerView, {stream: data, track: track}), self.el);
            //     console.log(data);
            //     data.play();
            // });
        }
    });



    Backbone.TrackModel = Backbone.Model.extend({
        defaults: {
            url: '',
            el: document.querySelector('.main')
        },
        initialize: function(options) {
            var self = this;
            SC.get('/resolve', {url: this.get('url')}, function(track) {
                SC.stream('/tracks/' + track.id, function(stream) {
            				React.render( d(playerView, {track: track, stream: stream}), self.get('el'));
                });
            });
        }
    });

    var playerView = React.createClass({
        getInitialState: function() {
        	console.log(this.props);
            this.props.stream.play();
            return {};
        },
        getDefaultProps: function() {
            return {};
        },
        play: function() {
            this.props.stream.play();
        },
        pause: function() {
            this.props.stream.pause();
        },
        render: function() {
            return d('div', [
                d('h1', this.props.track.title),
                d('h4', this.props.track.description),
                d('button.1', {
                    onClick: this.play
                }, 'play'),
                d('button.2', {
                    onClick: this.pause
                }, 'pause')
            ]);
        }
    });


})(typeof module === 'object' ? module.exports : window);
