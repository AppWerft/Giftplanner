exports.create = function(_total) {
	//if (_total > 0)return;
	var self = Ti.UI.createWindow({
		bottom : -500,
		backgroundColor : 'black'
	});
	self.open();
	self.add(Ti.UI.createLabel({
		color : 'white',
		left : 10,
		text : L('APPSTART'),
		top : 10,
		right : 10
	}));
	self.animate(Ti.UI.createAnimation({
		bottom : 0,
		duration:900
	}));
	self.addEventListener('click', function() {
		self.animate(Ti.UI.createAnimation({
			bottom : -600,
			duration : 800
		}));
		self.close();
	});
	
}
