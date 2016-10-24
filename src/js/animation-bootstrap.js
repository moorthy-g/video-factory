'use strict';

require('../style/main.less');
require('gsap');
require('es6-promise').polyfill();

window.injectConfig = function() {

	window.setconfig({
		'width': 854,
		'height': 480,
		'autoplay': true,
		'framerate': 30,
		'audio': require('../audio/audio.mp3')
		/* other config entries */
	});

};

var config = function () {
	return new Promise(function(resolve) {
		console.log('=== waiting for config ===');
		window.setconfig = function(config) {
			window.animationConfig = config;
			resolve();
		};

		//for preview purpose
		window.documentReady = true;
	});
}

var initAnimation = function() {
	var Animation = require('./animation');
	console.log('=== initiating animation ===');
	window.animation = new Animation(window.animationConfig, function() {
		window.ready = true;
		console.log('=== animation is ready to play ===');
	});
};

config()
.then(initAnimation)
.then(null, function(error){
	console.error(error)
})
