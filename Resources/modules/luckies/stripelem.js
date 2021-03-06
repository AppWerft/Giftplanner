exports.create = function(model, gift, key, options) {
	var self = Ti.UI.createView({
		height : 40,
		left : 10,
		right : 10,
		top : 5,
		bottom : 0,
		backgroundColor : 'white',
		borderRadius : 8
	});
	self.add(Ti.UI.createLabel({
		text : options.label,
		top : 5,
		left : 10,
		height : 16,
		color : '#777',
		font : {
			fontSize : 12
		}
	}));
	var textField = Ti.UI.createTextField({
	//	borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		bottom : 5,
		left : 10,
		width : 250,
		height : 25,
		value : gift[key]
	});
	textField.addEventListener('change',function(_e){
		gift[key] = textField.value;
		model.setGift(gift, key);
	});
	self.add(textField);
	return self;
}
