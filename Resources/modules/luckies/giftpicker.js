GiftPicker = function(model, friend) {
	return this.init(model, friend);
}

GiftPicker.prototype.init = function(model, friend) {
	var self = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		visible : false
	});
	self.darker = Ti.UI.createView({
		backgroundColor : '#700',
		opacity : 0.8,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL
	});
	self.add(self.darker);
	self.picker = Ti.UI.createPicker({
		top : 0,
		selectionIndicator : true
	});
	self.add(self.picker);
	var data = model.getAllGiftsPreview();
	for (var i = 0; i < data.gifts.length; i++) {
		var g = data.gifts[i];
		if (!g.status)
			continue;
		var row = Ti.UI.createPickerRow({
			id : data.gifts[i].id
		});
		var label = Ti.UI.createLabel({
			text : data.gifts[i].title,
			font : {
				fontSize : 20,
				fontWeight : 'bold'
			},
			color : '#000',
			left : 50,
			width : Ti.UI.FILL,
			height : 'auto'
		});
		var img = Ti.UI.createImageView({
			image : data.gifts[i].image,
			left : 0,
			width : 40,
			height : 40
		});
		row.add(label);
		row.add(img);
		self.picker.add(row);
	}
	return self;
}

GiftPicker.prototype.show = function() {
	
	self.show();
	setTimeout(function() {
		self.picker.animate(Ti.UI.createAnimation({
			top : 130,
			duration : 700
		}));
	}, 700);

}

module.exports = GiftPicker;
