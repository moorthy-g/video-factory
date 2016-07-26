var page = require('webpage').create();
var url = './build/index.html';

page.open(url, function (status) {

	console.log("=== start phantom ===");

	var frame = 0, animation,
	exit = function() {
		phantom.exit();
	},
	padWithZero = function(n, pad) {
		return ('00000' + n).slice(-pad);
	},
	init = function() {

		page.evaluate(function(test) {
			return window.injectConfig();
		});

		console.log("=== waiting for animation ===");

		var inter = setInterval(function() {

			var ready = page.evaluate(function() {
				return window.ready;
			});

			if(ready) {
				clearInterval(inter);
				console.log("=== start rendering ===");
				animationConfig = page.evaluate(function() {
					window.animation.go(0);
					return window.animationConfig;
				});
				page.viewportSize = {
					width: animationConfig.width,
					height: animationConfig.height
				};
				render();
			}

		}, 500);

	},
	render = function() {

		page.render('./frames_out/'+padWithZero(frame, 5)+'.png', {format: 'png'});

		console.log("Frame rendered => " + frame);

		frame = page.evaluate(function() {
			if(animation.next())
				return animation.currentFrame;
			else
				return false;
		});

		if(frame) render();
		else exit();
	};

	setTimeout(function() {
		init();
	}, 1000)

});
