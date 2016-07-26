'use strict';

function SceneCore() {
	this.tl = new TimelineLite({ paused: true });
	this.images = new Array();
}

SceneCore.prototype.parseHTML = function (htmlString) {
	var parent = document.createElement('div');
	parent.innerHTML = htmlString;
	return parent.firstChild;
};

module.exports = SceneCore;
