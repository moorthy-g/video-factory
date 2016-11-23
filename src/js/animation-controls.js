'use strict';

var AnimationHelper = require('./animation-helper'),
	AnimationControlsDOM = require('../view/animation-controls.html'),
	helper = new AnimationHelper();

function AnimationControls(animation) {
	var div = document.createElement('div'), controls,
		audio = this.audio = animation.audio;

	div.innerHTML = AnimationControlsDOM;
	controls = this.controls = div.firstChild,

	this.controlBar = controls.querySelector('.controlBar');
	this.toggleHit = controls.querySelector('.toggleHit');
	this.toggleBtn = controls.querySelector('.toggleBtn');
	this.soundBtn = controls.querySelector('.soundBtn');
	this.soundBar = controls.querySelector('.soundBar');
	this.playBtn = controls.querySelector('.playBtn');
	this.soundStatus = this.soundBar.querySelector('div');
	this.progressBar = controls.querySelector('.progressBar');
	this.progressStatus = this.progressBar.querySelector('div');
	this.animation = animation;
	this.duration = animation.tl.duration();
	this.volumeBeforeMute = null;
	this.paused = animation.tl.paused();
	this.replay = false;
	//helps to prevent mobile screen from sleep
	this.noSleep =	new ( require('./nosleep') )();

	if(audio) {
		this.setSoundProgress(0.6);
		this.volumeBeforeMute = 0.6;
	}

	this.init();
	animation.container.appendChild(controls);

	console.log('audio duration => ' + audio.duration);
}

AnimationControls.prototype.init = function() {
	var self = this, tl = this.animation.tl, playBtn = this.playBtn;

	//show controlbar
	self.controls.addEventListener('mouseenter', function() {
		self.showControlBar();
	});
	self.controls.addEventListener('mouseleave', function() {
		self.hideControlBar();
	});

	//toggle animation
	self.toggleBtn.addEventListener('mousedown', function() {
		self.toggle();
	});
	self.toggleHit.addEventListener('mousedown', function() {
		self.toggle();
	});



	if(helper.isApple()) {
		//no volume control available in apple. volume property always return 1
		self.soundBtn.remove();
		self.soundBar.remove();
	} else {
		//toggle sound
		self.soundBtn.addEventListener('mousedown', function() {
			self.toggleSound();
		});
	}



	//update progressbar
	tl.eventCallback('onUpdate', function() {
		self.updateProgress();
	});

	//endof animation
	tl.eventCallback('onComplete', function() {
		self.animation.onComplete();
		self.insistReplay();
	});

	//set progress
	self.progressBar.addEventListener('mouseup', function(e) {
		self.setProgress(e);
	});

	self.soundBar.addEventListener('mouseup', function(e) {
		self.setSoundProgress(e);
	});

	if(helper.isMobile() || !this.animation.config.autoplay) {

		playBtn.style.display = 'block';
		self.animation.tl.pause(1); //preview poster location
		self.pause();

		playBtn.addEventListener('mousedown', function() {

			playBtn.style.display = 'none';

			if( helper.isApple() ) {
				self.firstPlayApple();
			} else {
				self.seek(0);
				self.play();
			}

			self.noSleep.enable(10000)

		})

	} else { //autoplay animation for desktop
		self.play();
	}

}

AnimationControls.prototype.firstPlayApple = function() {
	var self = this, handler;
	self.audio.addEventListener('canplaythrough', handler = function() {
		console.info('=== IOS: audio can play through ===');
		self.seek(0);
		self.play();
		self.animation.hideLoader();
		self.audio.removeEventListener("canplaythrough", handler);
	});
	self.animation.showLoader();
	self.audio.load();
}

AnimationControls.prototype.injectControls = function () {

};

AnimationControls.prototype.toggle = function() {
	this.animation.tl.paused()?this.play():this.pause();
}

AnimationControls.prototype.play = function() {
	if(this.paused) {
		if(this.replay) {
			this.animation.tl.progress(0);
			//dirty fix for IE
			setTimeout(function() {
				this.audio.currentTime = 0;
			}.bind(this), 0)
			this.replay = false;
			this.noSleep.enable(10000);
		}
		this.animation.play();
		this.audio.play();
		this.paused = false;
		helper.removeClass(this.toggleBtn, 'replay')
		helper.addClass(this.toggleBtn, 'playing');
		this.animation.onPlay();
	}
}

AnimationControls.prototype.pause = function() {
	if(! this.paused) {
		this.animation.pause();
		this.audio.pause();
		this.paused = true;
		helper.removeClass(this.toggleBtn, 'playing')
		this.replay || this.animation.onPause();
	}
}

AnimationControls.prototype.seek = function(time) {
	this.animation.tl.time(time);
	this.audio.currentTime = time;
}

AnimationControls.prototype.insistReplay = function() {
	this.replay = true;
	this.pause();
	this.showControlBar();
	helper.addClass(this.toggleBtn, 'replay');
	this.noSleep.disable();
}

AnimationControls.prototype.toggleSound = function() {
	var audio = this.audio;

	if(audio.muted) {
		audio.muted = false;
		this.setSoundProgress(this.volumeBeforeMute);
		helper.removeClass(this.soundBtn, 'mute');
	} else {
		audio.muted = true;
		this.volumeBeforeMute = audio.volume;
		this.setSoundProgress(0);
		helper.addClass(this.soundBtn, 'mute');
	}
}

AnimationControls.prototype.setProgress = function(e) {
	var self = this;
	var progress = (e.pageX - helper.getOffsetX(this.progressBar) )/this.progressBar.offsetWidth;
	this.animation.tl.progress(progress);
	//dirty fix for IE
	setTimeout(function() {
		//incase we force timeline duration, timeScale helps to calculate currentTime
		self.audio.currentTime = this.animation.tl.time()/this.animation.tl.timeScale();
	}, 0)
	this.replay = false;
	this.play();
}

AnimationControls.prototype.updateProgress = function() {
	var progress = this.animation.tl.time()/this.duration*100;
	TweenLite.to(this.progressStatus, 0.1, {x:progress+'%'});
}

AnimationControls.prototype.setSoundProgress = function(e) {
	var soundBar = this.soundBar, offsetX, value;

	if(typeof e === 'number') {
		value = e;
	} else {
		offsetX = e.pageX - helper.getOffsetX(soundBar);
		value = offsetX/soundBar.offsetWidth;
	}

	this.audio.volume = value;
	TweenLite.to(this.soundStatus, 0.2, {x: this.audio.volume*100+'%'});
}

AnimationControls.prototype.showControlBar = function() {
	TweenLite.to(this.controlBar, 0.3, {y: 0});
}

AnimationControls.prototype.hideControlBar = function() {
	if(! this.paused)
		TweenLite.to(this.controlBar, 0.3, {y: 50});
}


module.exports = AnimationControls;
