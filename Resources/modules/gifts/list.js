exports.create = function(model) {
	var self = require('/modules/parts/xmaswindow').create('',true);
	var updateList = function() {
		model.getAllFreeGifts();
		self.actind.show();
		self.title = L('MYGIFTIDEAS');
		if (self.container) {
			self.remove(self.container);
			self.container = null;
		}
		self.actind.setMessage(L('RETRIEVEIDEAS'));
		self.container = require('/modules/parts/klorolle').create();
		self.add(self.container);
		var data = model.getAllGifts();
		self.actind.setMessage(L('RETRIEVED'));
		for (var i = 0; i < data.gifts.length; i++) {
			var g = data.gifts[i];
			self.actind.setMessage(L('GOTIMAGE') + g.id);
			var view = require('/modules/gifts/tile').create(data.gifts[i],i);
			self.container.add(view);
		}	
		self.container.add(Ti.UI.createView({top: 7.5 + Math.floor(i / 2+1) * 155,height:200}));
		self.actind.hide();
	}
	self.actind = require('/modules/parts/actind').create('');
	self.add(self.actind);
	Ti.App.addEventListener('app:giftmodified',updateList)
	self.addEventListener('focus', updateList);
	
	self.addEventListener('click', function(_e) {
		if (_e.source.gift && _e.source.gift.id && typeof (_e.source.gift.id) == 'number') {
			var giftwindow = require('/modules/gifts/gift').create(model, _e.source.gift);
			self.tab.open(giftwindow);
		}
	});
	return self;
}
