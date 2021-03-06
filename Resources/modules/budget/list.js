exports.create = function(model) {
	var BUDGETHEIGHT = 150;
	var self = require('/modules/parts/xmaswindow').create('Budget', true);

	var TOTAL = require('/modules/budget/calculator');
	self.total = new TOTAL;
	self.add(self.total.getView(BUDGETHEIGHT));

	self.actind = require('/modules/parts/actind').create('');
	self.add(self.actind);
	self.container = Ti.UI.createTableView({
		bottom : BUDGETHEIGHT,
		separatorColor : '#770000',
		backgroundColor : 'transparent'
	});
	self.add(self.container);
	self.addEventListener('focus', function() {
		self.actind.show();
		self.title = L('NAVI_BUDGET');
		self.actind.setMessage('Retrieve your ideas from database');
		var data = model.getAllGifts();
		Ti.App.fireEvent('pricechanged', {
			price : data.price
		})
		self.actind.setMessage('Retrieved, now I render …');
		var rows = [];

		for (var i = 1; i < data.gifts.length; i++) {
			var g = data.gifts[i];
			self.actind.setMessage('Got image №' + g.id);
			var row = Ti.UI.createTableViewRow({
				height : 70,
				gift : g,
			});
			if (g.thumb) {
				var img = Ti.UI.createImageView({
					image : g.thumb,
					width : 60,
					top : 5,
					bottom : 5,
					defaultImage : '',
					gift : g,
					left : 10,
					height : 60,
					borderRadius : 5,
					backgroundColor : 'transparent'
				});
				row.add(img);
			}
			if (g.user != null) {
				img.add(Ti.UI.createImageView({
					image : '/assets/icon_linked.png',
					left : 3,
					top : 1,
					width : 20,
					height : Ti.UI.SIZE
				}))
			}
			row.add(Ti.UI.createLabel({
				text : g.title,
				left : 85,
				height : 40,
				color : 'white',
				right : 90,
				font : {
					fontWeight : 'bold',
					fontSize : 15
				}
			}));
			row.add(Ti.UI.createLabel({
				text : g.price + ',–',
				color : 'white',
				right : 25,
				font : {
					fontSize : 18
				}
			}));
			rows.push(row);
		}
		self.container.data = rows;
		self.actind.hide();
	});

	self.addEventListener('click', function(_e) {
		if (!_e.rowData)
			return;
		var gift = _e.rowData.gift;
		self.tab.open(require('/modules/gifts/gift').create(model, gift));

	});
	return self;
}
