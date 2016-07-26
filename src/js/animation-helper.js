'use strict';

function Helper() {	}

Helper.prototype.addClass = function(element, className) {
	var classList = element.className.split(" "),
	index = classList.indexOf(className);
	if(index == -1) {
		element.className += " " + className;
	}
}

Helper.prototype.removeClass = function(element, className) {
	var classList = element.className.split(" "),
	index = classList.indexOf(className);
	if(index != -1) {
		classList.splice(index,1);
		element.className = classList.join(" ");
	}
}

Helper.prototype.toggleClass = function(element, className) {
	var index = element.className.indexOf(className);
	if(index == -1) {
		this.addClass(element, className)
	} else {
		this.removeClass(element, className)
	}
}

Helper.prototype.extend = function(oldObj, newObj) {
	for(var key in newObj) {
		oldObj[key] = newObj[key];
	}
}

Helper.prototype.getOffsetX = function(elem) {
	var offsetLeft = 0, offsetParent = elem.offsetParent;
	offsetLeft = elem.offsetLeft + (offsetParent?this.getOffsetX(offsetParent):0);
	return offsetLeft;
}

Helper.prototype.isMobile = function() {
	return !! navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
}

Helper.prototype.isApple = function() {
	return !! navigator.userAgent.match(/iPhone|iPad|iPod/i);
}

module.exports = Helper;
