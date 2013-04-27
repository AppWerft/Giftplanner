exports.create = function(model, gift) {
	var self = require('/modules/parts/xmaswindow').create('Gift №' + gift.id);
	var rightButton = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.COMPOSE
	});
	self.container = require('/modules/parts/klorolle').create();
	self.container.layout = 'vertical';
	self.container.width = 320;
	self.container.contentWidth = 320;

	self.container.contentHeight = 600;
	self.add(self.container);
	self.title = gift.title;
	self.actind = require('/modules/parts/actind').create('');
	self.add(self.actind);

	var titlecontainer = require('/modules/gifts/gifteditor').create({
		model : model,
		gift : gift,
		hint : L('HINTNAME'),
		key : 'title',
		label : L('TITLE')
	});
	self.container.add(titlecontainer);
	var statuscontainer = require('/modules/gifts/gift2friend').create({
		model : model,
		gift : gift,
		label : L('BESCHENKTER')
	});
	self.container.add(statuscontainer);


	var pricecontainer = require('/modules/gifts/gifteditor').create({
		model : model,
		gift : gift,
		hint : L('HINTPRICE'),
		key : 'price',
		label : L('PRICE'),
		keyboardType :Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION
	});
	self.container.add(pricecontainer);

	

	self.container.add(require('/modules/gifts/imageelement').create(model, gift, self.actind));
var descriptioncontainer = require('/modules/gifts/gifteditor').create({
		model : model,
		gift : gift,
		textarea : true,
		hint : L('HINTNOTES'),
		key : 'description',
		label : L('NOTES')
	});
	self.container.add(descriptioncontainer);
	var wegbutton = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.TRASH
	});
	self.rightNavButton = wegbutton;
	wegbutton.addEventListener('click', function() {
		model.deleteGift(gift, function(_result) {
			if (_result != null)
				self.close();
		});
	});
	return self;
}
