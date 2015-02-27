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
            this.defaultTrack = new Backbone.TrackModel({url: 'https://soundcloud.com/magnusvaltias/a-b-c-ya-later'});
            this.defaultView = d(playerView, {model: this.defaultTrack});
            this.loadTrack(this.defaultTrack).then(function(data){
            		this.defaultTrack.get('stream').play();
            		React.render(this.defaultView, this.el);
            }.bind(this));
            // render when loaded
        },
        loadTrack: function(model){
        		var x = $.Deferred();
        		SC.get('/resolve', {url: model.get('url')}, function(data){
        				model.set('track', data);
        				SC.stream('/tracks/' + data.id, function(d){
        					model.set('stream', d);
        					x.resolve(model);
        				});
        		});
        		return x;
        }
    });



    Backbone.TrackModel = Backbone.Model.extend({
        defaults: {
            url: '',
            el: document.querySelector('.main')
        },
        initialize: function() {
        }
    });

    var playerView = React.createClass({
        getInitialState: function() {
        		this.props.model.get('stream').setVolume(50);
            return {
            	position: '',
            	paused: false,
            	volume: 50
            };
        },
        getDefaultProps: function() {
            return {};
        },
        componentDidMount: function(){
        		this.interval = setInterval(this.tick, 100);
        		console.log(this.props.model);
        },
        componentWillUnmount: function(){
        		clearInterval(this.interval);
        },
        tick: function() {
        		var mins = Math.floor(this.props.model.get('stream').position/60000).toString();
        		var secs = Math.floor((this.props.model.get('stream').position/1000)%60).toString();
        		if (secs.length === 1) secs = '0'+secs;
        		this.setState({
        				position: mins+':'+secs
        		});
        },
        play: function() {
            this.props.model.get('stream').play();
            this.setState({
            		paused: false
            });
        },
        pause: function() {
            this.props.model.get('stream').pause();
            this.setState({
            		paused: true
            });
        },
        volume: function(){
        		this.props.model.get('stream').setVolume(this.refs.volume.getDOMNode().value);
        		this.setState({
        				volume: this.refs.volume.getDOMNode().value
        		});
        },
        replay: function(){
        	// this.props.model.get('stream').start();
        },
        render: function() {
        		var m = this.props.model;
        		var pic = m.get('track').artwork_url || m.get('track').user.avatar_url || false;
        		var mins = Math.floor(m.get('stream').durationEstimate/60000).toString();
        		var secs = Math.floor((m.get('stream').durationEstimate/1000)%60).toString();
        		var paused = this.state.paused;
        		if (secs.length === 1) secs = '0'+secs;
            return d('div', [
            		pic ? d('img', {src: pic}) : '',
                d('h1', m.get('track').title),
                d('h3', m.get('track').user.username),
                d('h4', m.get('track').description),
                d('input:checkbox#plps' + m.get('track').id, {onClick: paused ? this.play : this.pause}),
                d('label[htmlFor=plps' + m.get('track').id + ']', paused ? 'play' : 'pause'),
                d('input:range@volume#vol' + m.get('track').id, {value: this.state.volume, step: 5, onChange: this.volume}),
                d('label[htmlFor=vol' + m.get('track').id, 'volume'),
                // d('button', {onClick: this.replay}, 'replay'),
                d('h6', {key: 'position'}, this.state.position),
                d('h6', {key: 'duration'}, mins + ':' + secs),
                d('h6', {key: 'played'}, m.get('track').playback_count + ' plays'),
                d('h6', {key: 'favorites'}, m.get('track').favoritings_count + ' <3\'s'),
                d('a', {href: m.get('track').permalink_url},
                		d('h6', 'via SoundCloud')
                )
            ]);
        }
    });


})(typeof module === 'object' ? module.exports : window);
