exports.create = function(model) {
	var self = require('/modules/parts/xmaswindow').create(L('NAVI_LUCKIES'),true);
	var performAddressBookFunction = function() {
		var contacts = Ti.Contacts.getAllPeople();
		var friends = [];
		for (var i = 0; i < contacts.length; i++) {
			var c = contacts[i];
			var firstname = (c['firstName']) ? c['firstName'] : '';
			var lastname = (c['lastName']) ? c['lastName'] : '';
			friends[i] = {};
			friends[i].id = c['recordId'];
			friends[i].image = c['image'];
			friends[i].name = firstname + ' ' + lastname;
			friends[i].birthday = c['birthday'];
		};
		self.popup = require('/modules/luckies/import/popup').create(model, friends);
		if (self.popup)
			self.popup.addEventListener('selected', function(_s) {
				model.setFriends(_s.luckies);
			});
		contacts = null;
		self.actind.hide();

	};
	var addressBookDisallowed = function() {
	};

	var plus = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.ADD
	});
	self.title = L('NAVI_LUCKIES');
	self.rightNavButton = plus;
	plus.addEventListener('click', function(_e) {
		var opts = {
			cancel : 2,
			options : [L('FBIMPORT'), L('ABIMPORT'), L('CANCEL')],
			title : L('ACTIONCHOOSE')
		};
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show();
		dialog.addEventListener('click', function(_e) {
			if (_e.index==2) return;
			self.actind = require('/modules/parts/actind').create();
			self.add(self.actind);
			switch (_e.index) {
				case 2:
					self.tab.open(require('/modules/luckies/lucky').create(model));
					break;
				case 1:
					self.actind.show();
					self.actind.setMessage(L('ABIMPORT'));
					if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
						performAddressBookFunction();
					} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN) {
						Ti.Contacts.requestAuthorization(function(e) {
							if (e.success) {
								performAddressBookFunction();
							} else {
								addressBookDisallowed();
							}
						});
					} else {
						addressBookDisallowed();
					}

					break;
				case 0:
					self.actind.show();
					self.actind.message = L('FBIMPORT');
					setTimeout(function() {
						self.actind.hide();
					}, 10000)

					require('/modules/luckies/import/facebook').get({}, function(friends) {
						self.actind.hide();
						if (friends) {
							self.popup = require('/modules/luckies/import/popup').create(model, friends);
							if (self.popup)
								self.popup.addEventListener('selected', function(_s) {
									model.setFriends(_s.luckies);
								});
						}
					});
					break;
			}
		});
	});
	self.container = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		separatorColor : '#770000',
		bottom : 30
	});
	self.container.addEventListener('click', function(_e) {
		self.tab.open(require('/modules/luckies/lucky').create(model, _e.rowData.friend));
	});
	Ti.App.addEventListener('app:usermodified', function() {
		var luckies = model.getAllLuckiesPreview();
		var rows = [];
		for (var i = 0; i < luckies.length; i++) {
			var f = luckies[i];
			var row = Ti.UI.createTableViewRow({
				friend : f,
				height : 60,
				hasChild : false
			});
			row.add(Ti.UI.createImageView({
				image : f.image,
				left : 0,
				height : 60,
				width : 60
			}));
			row.add(Ti.UI.createImageView({
				image : model.getStatusByFriend(f.id).png,
				right : 10,
				height : 25,
				width : 80
			}));
			row.add(Ti.UI.createLabel({
				text : f.fullname,
				left : 70,
				right : 100,
				color : 'white',
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				}
			}));

			rows.push(row);
		}
		self.container.setData(rows);
	});
	self.add(self.container);
	Ti.App.fireEvent('app:usermodified');
	return self;
}
