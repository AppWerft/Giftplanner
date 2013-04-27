exports.play = function(ji) {
	var player = Ti.Media.createSound({url:"/assets/sounds/" + ji + '.mp3'});
	player.play();
}
