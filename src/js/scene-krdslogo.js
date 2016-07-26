'use strict';

var SceneCore = require('./scene-core'),
	template = require('../view/scene-krdslogo.html');

var scene = new SceneCore(), container = scene.container = scene.parseHTML(template),
myElement = container.querySelector('.myElement'), tl = scene.tl;

tl.to(myElement, 5, { y:300, x:450, visibility:"visible" });

//images to preload for this scene
scene.images.push( require("../img/logo.png") );

module.exports = scene;
