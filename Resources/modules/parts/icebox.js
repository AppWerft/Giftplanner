exports.create = function(_options) {
	var self = Ti.UI.createView({
		borderRadius : 10,
	});	
	if ( typeof (_options) === 'object') {
		for (var key in _options) {
			self[key] = _options[key];
		}
	}
	var bg = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundGradient : {
			type : 'linear',
			colors : ['#999', '#111'],
			startPoint : {
				x : 0,
				y : 0
			},
			endPoint : {
				x : 0,
				y : _options.height
			},
			backFillStart : false
		},
		opacity : 0.36,
		borderRadius : 6,
	});
	
	self.add(bg);
	return self;
}
