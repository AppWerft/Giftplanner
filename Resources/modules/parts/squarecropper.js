exports.crop = function(foo) {
	var ImageFactory = require('ti.imagefactory');
	if (foo.width == foo.height && foo.width > 2500) {
		var ratio = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.platformHeight;
		if (ratio > 1)
			ratio = 1 / ratio;
		var PADDING = (1 - ratio) / 2;
		var width = foo.width - (2 * PADDING * foo.width);
		var options = {
			width : width,
			height : width,
			x : (foo.width - width)/2,
			y : (foo.width - width)/2
		};
	} else if (foo.width > foo.height) {
		Ti.API.log('LANDSCAPE');
		var width = foo.height;
		var options = {
			width : width,
			height : width,
			x : (foo.width - foo.height) / 2,
			y : 0
		};
	} else {
		Ti.API.log('PORTRAIT');
		var width = foo.width;
		var options = {
			width : width,
			height : width,
			x : 0,
			y : (foo.height - foo.width) / 2,
		};
	}
	Ti.API.log(options);
	var bar = ImageFactory.imageAsCropped(foo, options);
	Ti.API.log(bar);
	return bar;
}