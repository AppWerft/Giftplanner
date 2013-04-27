exports.create = function(model) {
	var self = require('/modules/parts/xmaswindow').create('My Clause');
	self.actind = require('/modules/parts/actind').create('');
	self.add(self.actind);
	self.addEventListener('focus', function() {
		self.actind.show();
		if (self.container) {
			self.remove(self.container);
			self.container = null;
		}
		self.actind.setMessage('Retrieve all needed stuff from database');
		self.actind.hide();
	});
	return self;
}