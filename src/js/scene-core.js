'use strict';

function SceneCore(config, template) {
	this.tl = null;
	this.config = config;
	this.container = null;
	this.images = new Array();

	this.parseTemplate(template);
	this.createPreloadQueue && this.createPreloadQueue();
}

SceneCore.prototype.parseTemplate = function (template) {
	var parent = document.createElement('div');
	parent.innerHTML = template;
	this.container = parent.firstChild;
};

module.exports = SceneCore;
