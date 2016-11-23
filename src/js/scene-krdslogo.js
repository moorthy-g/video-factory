'use strict';

var SceneCore = require('./scene-core');

function Scene(config) {
	//call super constructor
	SceneCore.call( this, config, require('../view/scene-krdslogo') );
}

// extend scene core
Scene.prototype = Object.create(SceneCore.prototype);
Scene.prototype.constructor = SceneCore;

Scene.prototype.createTimeline = function() {
	var container = this.container,
		tl = this.tl = new TimelineLite({ paused: true }),
		myElement = container.querySelector('.myElement');

	//timeline
	tl.to(myElement, 5, { y:300, x:450, visibility:"visible" });
}

Scene.prototype.createPreloadQueue = function() {
	//images to preload for this scene
	this.images.push( require("../img/logo.png") );
}

module.exports = Scene;
