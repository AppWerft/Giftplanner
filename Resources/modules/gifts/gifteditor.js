exports.create = function(_data) {
	var self = Ti.UI.createView({
		height : Ti.UI.SIZE
	});
	self.box = require('/modules/parts/icebox').create({
		left : 100,
		height : (_data.textarea) ? 100 : 40,
		top : 8,
		bottom : 2,
		right : 4
	});
	self.add(Ti.UI.createLabel({
		text : _data.label,
		right : 235,
		top : 15,
		height : 16,
		textAlign : 'right',
		width : Ti.UI.FILL,
		color : '#fff',
		font : {
			fontSize : 14
		}
	}));
	var textField = (_data.textarea != true) ? Ti.UI.createTextField({
		color : 'white',
		bottom : 3,
		left : 10,
		font : {
			fontSize : 18
		},
		width : Ti.UI.FILL,
		
		backgroundColor : 'transparent',
		height : Ti.UI.FILL,
		value : _data.gift[_data.key]
	}) : Ti.UI.createTextArea({
		color : 'white',
		font : {
			fontSize : 18
		},

		bottom : 3,
		backgroundColor : 'transparent',
		left : 5,

		width : Ti.UI.FILL,
		height : 90,
		hintText : _data.hint || '',
		enableReturnKey : true,
		value : _data.gift[_data.key]
	});
	if (_data.keyboardType) textField.keyboardType = _data.keyboardType;
	textField.addEventListener('change', function(_e) {
		_data.gift[_data.key] = textField.value;
		_data.model.setGift(_data.gift, _data.key);
	});
	self.box.add(textField);
	self.add(Ti.UI.createImageView({
		image : '/assets/keyboard.png',
		width : 25,
		top : 10,
		right : 15,
		height : Ti.UI.SIZE
	}));
	self.add(self.box);
	return self;
}
