exports.create = function(model, friend) {
	var friendname = (friend) ? friend.fullname : L('NEWFRIEND');
	var self = require('/modules/parts/xmaswindow').create(friendname);
	self.LEFTCOL = 100;
	self.LEFT = self.LEFTCOL + 10;
	self.RIGHT = 320 - self.LEFTCOL + 10;
	self.FONTSIZE = 14;
	self.title = L('LUCKY');

	var rightButton = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.COMPOSE
	});
	self.rightNavButton = rightButton;
	rightButton.addEventListener('click', function() {
		Ti.API.log(friend.status);
		var options = [];
		var actions = [];
		switch (friend.status) {
			case 0:
			case null:
				options = [L('CHOOSEGIFT'), L('FORGETFRIEND_TITLE'), L('CANCEL')];
				break;
			case 1:
				options = [L('UNLINKGIFT'), L('FORGETFRIEND_TITLE'), L('CANCEL')];
				break;
			case 2:
				options = [L('UNLINKGIFT'), L('FORGETFRIEND_TITLE'), L('CANCEL')];
				break;
			case 3:
				options = [L('UNLINKGIFT'), L('FORGETFRIEND_TITLE'), L('CANCEL')];
				break;
		}
		var dialog = Ti.UI.createOptionDialog({
			options : options,
			cancel : options.length - 1,
			destructive : options.length - 2,
			title : 'Please select action'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index == options.length - 1)
				return;
			else if (e.index == options.length - 2) {
				var alertDialog = Ti.UI.createAlertDialog({
					title : L('FORGETFRIEND_TITLE'),
					message : L('FORGETFRIEND_MSG'),
					buttonNames : ['OK', L('CANCEL')]
				});
				alertDialog.show();
				alertDialog.addEventListener('click', function(_e) {
					if (_e.index == 0) {
						model.deleteFriend(friend);
						self.close();
					}
				});
				return;
			} else {
				if (friend.status == 0 || friend.status == null) {
					Ti.App.fireEvent('friend:choosegift!');
				} else {
					friend.status = 0;
					model.unlinkGiftFromFriend(friend);
				}
			}

		});
		dialog.show();
	});

	self.tableview = Ti.UI.createTableView({
		height : Ti.UI.FILL,
		separatorColor : 'transparent',
		selectedBackgroundColor : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		//	separatorColor : 'black',
		backgroundColor : 'transparent'
	});
	self.add(self.tableview);
	setTimeout(function() {
		self.tableview.appendRow(require('/modules/luckies/lucky_user').create(model, friend, self));
		// falls freie Geschenke oder schon festgelegt:
		var freegifts = model.getAllFreeGifts();
		if (freegifts.count > 0 || friend.giftid) {
			self.tableview.appendRow(require('/modules/luckies/lucky_gift').create(model, friend, self));
		}
		self.tableview.appendRow(require('/modules/luckies/lucky_status').create(model, friend, self));
		/* falls Facebooker, dann einblenden: */
		if (friend.fb == true) {
			self.tableview.appendRow(require('/modules/luckies/lucky_fblikes').create(model, friend, self));
		}
	}, 0);
	return self;
}
