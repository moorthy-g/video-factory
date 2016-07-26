var childProcess  = require('child_process'),
	spawn = childProcess.spawn,
	ffmpeg = require('fluent-ffmpeg'),
	fs = require('fs-extra');

var child = spawn("phantomjs", [__dirname + "/render-screens.js"]);

//remove the directory, if exists
fs.remove('./frames_out');
fs.mkdirs('./video_out');

child.stdout.on('data', function(data) {
	console.log(data.toString());
})

child.on("exit", function(code) {
	console.log("=== exit phantom ===\n");
	generateVideo();
});


var generateVideo = function() {
	console.log("=== generate video ===");

	ffmpeg()
	.addInput('./frames_out/%5d.png')
	.videoCodec('libx264')
	.videoBitrate('1000k')
	.addInput('./build/audio/audio.mp3')
	.audioCodec('libmp3lame')
	.audioBitrate('96k')
	.addOption('-pix_fmt', 'yuv420p')
	.size('854x480')
	.fps(30)
	.inputFPS(30)
	.on('error', function(err) {
		console.log("Error: "+err);
	})
	.on('end', function() {
		//remove the directory
		fs.remove('./frames_out');
		console.log("=== video is ready ===");
	})
	.save('./video_out/video.mp4');
}
