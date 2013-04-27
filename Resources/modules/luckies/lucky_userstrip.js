exports.create = function(_model, _friend, _parent) {
	var self = Ti.UI.createView({
		height : 100,
		top:0
	});
	self.userphoto = Ti.UI.createImageView({
		image : _friend.image,
		defaultImage : '',
		width : 70,
		height : 70,
		right : _parent.RIGHT,
		top : 20,
	});
	self.add(self.userphoto);
	self.name = Ti.UI.createLabel({
		left : _parent.LEFT,
		color : 'white',
		top : 40,
		height:50,
		right : 10,
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		},
		text : _friend.fullname
	});
	self.add(self.name)
	return self;
};
