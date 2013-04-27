exports.create = function(model, friend, parent) {
	var self = Ti.UI.createTableViewRow({
		height : 60
	});
	self.add(Ti.UI.createLabel({
		right : parent.RIGHT,
		color : 'white',
		text : L('STATUS'),
		font : {
			fontSize : parent.FONTSIZE
		},
		top : 5,
		height : 20
	}));
	self.add(require('/modules/parts/icebox').create({
		left : parent.LEFT,
		top : 5,
		height : 55,
		right : 10,
		bottom : 5
	}));
	var statusView = Ti.UI.createImageView({
		image : model.getStatusByFriend(friend.id).png,
		height : Ti.UI.SIZE,
		left : parent.LEFT + 5,
		width : 120,
		status : friend.status
	});
	statusView.addEventListener('click', function(_e) {
		if (friend.status == null) return;
		var bar = model.updateFriendStatus(friend);
		if (bar == null)
			return;
		Ti.API.log(bar);
		statusView.status = bar.status;
		statusView.image = bar.png;
		friend.status = bar.status;
		if (bar.close == true)
			parent.close();

	});
	Ti.App.addEventListener('app:usermodified', function() {
		statusView.image = model.getStatusByFriend(friend.id).png;
	});
	self.add(statusView);
	return self;
}
