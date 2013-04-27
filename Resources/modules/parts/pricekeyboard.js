exports.get = function(_options) {
	var flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var ok = Titanium.UI.createButton({
		title : 'OK',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});
	var budget = Ti.UI.createLabel({
		text : L('TOTALBUDGET') + ': ',
		width : 200,
		color : 'white'
	});
	var self = Ti.UI.createTextField({
		value : '1000',
		color : 'white',
		keyboardToolbarColor : '#900',
		keyboardToolbarHeight : 40,
		keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD,
		left : this.LEFT,
		keyboardToolbar : [flexSpace, budget, ok],
		font : this.BIGFONT,
		right : 0,
		textAlign : 'right',
		width : Ti.UI.FILL
	});
	self.addEventListener('focus', function() {
		var val = parseInt(self.value);
		self.setValue(val);
		budget.text = L('TOTALBUDGET') + ': ' + val;
	});
	for (var key in _options) {
		self[key] = _options[key];
	}
	self.ok = ok;
	self.addEventListener('change', function() {
		setTimeout(function() {
			var val = parseInt(self.value);
			if (isNaN(val)) val=0;
			self.setValue(val);
			budget.text = L('TOTALBUDGET') +': ' + self.value + ',– ';
		}, 70);
	});
	return self;
}  