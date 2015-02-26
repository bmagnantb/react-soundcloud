window.onload = app;

// runs when the DOM is loaded
function app(){
    "use strict";

    // uncomment the following line to cache CSS/JS files loaded by loader in localStorage
    // NOTE: you may need to turn this off while developing
    // loader.textInjection = true;

    // load some scripts (uses promises :D)
    loader.load(
        //css
        {url: "./dist/style.css"},
        //js
        {url: "./bower_components/jquery/dist/jquery.min.js"},
        {url: "./bower_components/lodash/lodash.min.js"},

        // when using just Backbone, use this line
        {url: "./bower_components/backbone/backbone.js"},
        // when using Parse, comment out the above line and uncomment the line below
        // {url: "./bower_components/parse-js-sdk/lib/parse.min.js"},

        // when using React (and the plugin JSnoX), uncomment the following two lines
        {url: "./bower_components/react/react.js"},
        {url: "./bower_components/jsnox/index.js"},

        // other stuff
        {url: "./bower_components/pace/pace.min.js"},
        {url: "//connect.soundcloud.com/sdk.js"},
        {url: "./js/player.js"}
    ).then(function(){
        // if turning on JSnoX, uncommment the following line
        window.d = jsnox(React);
        // if turning on React, uncomment the following line
        React.initializeTouchEvents(true);

        SC.initialize({
    			client_id: "5dc652f77bfdcfdbdc897e4f2860d4d7",
  			});

        document.querySelector("html").style.opacity = 1;
        // start app?

        new Backbone.PlayerRouter();
    });

}