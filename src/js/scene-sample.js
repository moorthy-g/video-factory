'use strict';
// require style
require('../style/scene-sample');

var SceneCore = require('./scene-core');

function Scene(config) {
	//call super constructor
	SceneCore.call( this, config, require('../view/scene-sample') );
}

// extend scene core
Scene.prototype = Object.create(SceneCore.prototype);
Scene.prototype.constructor = SceneCore;

Scene.prototype.createTimeline = function() {
	var container = this.container,
		tl = this.tl = new TimelineLite({ paused: true }),
		myElement = container.querySelector('.myElement');

	//timeline
	tl.to(myElement, 5, { y:170, x:640, visibility:"visible" });
}

Scene.prototype.createPreloadQueue = function() {
	//images to preload for this scene
	this.images.push( this.config.sample.img );
	/* incase of static images, use
		this.images.push( require('../img/logo.png') );
	 */
}

module.exports = Scene;
