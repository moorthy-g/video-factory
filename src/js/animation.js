'use strict';

function Animation(config, callback) {

	this.tl = new TimelineMax({ paused: true });
	this.config = config;
	this.audio = null;
	this.notPhantom = navigator.userAgent.indexOf("PhantomJS") == -1;
	this.loader = document.getElementById('animation_loader');
	this.container = document.getElementById('animation_container').firstElementChild;
	this.images = [];
	this.storyBoard = new Array();
	this.onComplete = new Function();
  	this.onPause = new Function();
  	this.onPlay = new Function();

	this.createStoryBoard()
		.then( this.preloadElements.bind(this) )
		.then( this.executeStoryBoard.bind(this) )
		.then( this.initControls.bind(this) )
		.then( this.finalSetup.bind(this) )
		.then( callback.bind(this) )
};

Animation.prototype.createStoryBoard = function() {

	//add scene sequence
	this.addScene( require('./scene-krdslogo') );

	return Promise.resolve();

}

Animation.prototype.addScene = function (Scene, position) {
	var scene = new Scene(this.config);
	this.storyBoard.push( {scene: scene, position: position} )
	this.images = this.images.concat(scene.images);
};

Animation.prototype.executeStoryBoard = function() {

	this.storyBoard.forEach(function(story) {

		var scene = story.scene;
		this.container.appendChild(scene.container);
		scene.createTimeline();
		this.tl.add( scene.tl.play(), story.position );

	}.bind(this))

}

Animation.prototype.preloadElements = function(callback) {

	return new Promise(function(resolve, reject){

		var imagesReady = false, audioReady = false, self = this;

		//syncronize image preload
		(function recursePreload(){
			var image = self.images.shift();
			if(image)
				self.loadImage(image).then(recursePreload);
			else {
				console.info('=== images preloaded ==='),
				imagesReady = true;
				audioReady && resolve();
			}
		})()

		//audio preload
		if(this.notPhantom && this.config.audio) {

			var isApple =  navigator.userAgent.match(/iPhone|iPad|iPod/i),
				audio = this.audio = document.createElement('audio'), handler;

			audio.src = this.config.audio;
			audio.preload = 'auto'; //firefox needs this
			this.container.appendChild(audio);

			if(! isApple) { //ios doesn't preload audio, until user plays it.
				audio.addEventListener("canplaythrough", handler = function() {
					console.info('=== audio can play through ===');
					audioReady = true;
					imagesReady && resolve();
					audio.removeEventListener("canplaythrough", handler);
				});
				audio.load();
			} else { //In ios audio loads, after user interaction
				console.info('=== IOS: audio can be played through controls ===');
				audioReady = true;
			}

		} else {
			audioReady = true;
		}

		imagesReady && audioReady && resolve();

	}.bind(this));

}

Animation.prototype.loadImage = function(src) {
	return new Promise(function(resolve, reject){
		var img = new Image();
		console.info('preloading =>', src);

		img.onload = img.onerror = function(e) {
			if (e.type === 'error')
				console.error('=== preload error ===');

			resolve();
		}

		img.src = src;
	})
};

Animation.prototype.initControls = function() {
	if(this.notPhantom) {
		var AnimationControls = require('./animation-controls');
		this.controls = new AnimationControls(this);
	}
}

Animation.prototype.finalSetup = function () {
	var actualDuration = this.tl.duration() / this.tl.timeScale();

	this.hideLoader();

	this.totalFrames = Math.floor(actualDuration * this.config.framerate);
	this.currentFrame = 0;

	console.log("timeline duration => " + this.tl.duration());
	console.log("forced duration => " + actualDuration);
	console.log("totalframes => " + this.totalFrames);
};

Animation.prototype.getCurrentTime = function () {
	return this.tl.time() / this.tl.timeScale();
};

Animation.prototype.showLoader = function () {
	this.loader.style.display = 'block';
};

Animation.prototype.hideLoader = function () {
	this.loader.style.display = 'none';
};

Animation.prototype.go = function(frame) {
	if(0 > frame || frame > this.totalFrames)
		return false;

	this.currentFrame = frame;
	this.pause();
	this.tl.progress(frame/this.totalFrames);

	return true;
}

Animation.prototype.play = function() {
	this.tl.play();
}

Animation.prototype.pause = function() {
	this.tl.pause();
}

Animation.prototype.toggle = function() {
	this.tl.toggle();
}

Animation.prototype.prev = function() {
	if(this.currentFrame - 1 >= 0)
		return this.go(this.currentFrame - 1);

	return false;
}

Animation.prototype.next = function() {
	if(this.currentFrame + 1 < this.totalFrames)
		return this.go(this.currentFrame + 1);

	return false;
}

module.exports = Animation;
