exports.create = function(model, friend, parent) {
	var self = Ti.UI.createTableViewRow();
	self.userphoto = Ti.UI.createImageView({
		image : friend.image,
		defaultImage : '',
		width : 70,
		height : 70,
		right : parent.RIGHT,
		top : 10,
		bottom:10
	});
	self.add(self.userphoto);
	self.name = Ti.UI.createTextField({
		left : parent.LEFT,
		color : 'white',
		top : 40,
		right : 10,
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		},
		value : friend.fullname
	});
	self.add(self.name)
	return self;
};
