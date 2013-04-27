CoverFlow = function(_model, _pb, _friend) {
	this.friend = _friend;
	this.model = _model;
	this.pb = _pb;
	
	return this.init();
}

CoverFlow.prototype.init = function() {
	var linkGift = function() {
		var options = {
			gift : self.giftid,
			friend : self.friend.id
		};
		
		self.model.linkGift2Friend(options);
		self.fireEvent('linking:done');
		self.hide();
	};
	self = Ti.UI.createView({
		width : Ti.UI.FILL,
		model : this.model,
		friend : this.friend,
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

	self.bb = Ti.UI.createButtonBar({
		labels : [L('CANCEL'), 'OK'],
		backgroundColor : '#a00',
		top : 0,
		style : Ti.UI.iPhone.SystemButtonStyle.BAR,
		height : 35,
		width : 320
	});
	self.bb.addEventListener('click', function(e) {
		if (e.index == 1) {
			linkGift();
		} else {
			self.hide();
		}
	});
	var data = this.model.getAllFreeGifts();
	if (data.gifts.length == 0)
		return self;

	/* es gibt freie Geschenke: */
	self.cf = Ti.UI.iOS.createCoverFlowView({
		top : 0,
		width : 320,
		height : 360
	});
	self.add(self.cf);
	self.add(self.bb);

	var images = [];
	var len = data.gifts.length;
	this.pb.max = len;
	
	for (var i = 0; i < len; i++) {
		var g = data.gifts[i];
		if (!g.status)
			continue;
		if (data.gifts[i].image) {
			images.push({
				image : data.gifts[i].image,
				width : 240,
				gift : data.gifts[i],
				height : 240
			});
			this.pb.value = i;
		}

		//views.push(view);
	}
	this.pb.hide();
	// Starrbelegung
	self.giftid = data.gifts[0].id;
	// merken!
	self.cf.images = images;
	self.label = Ti.UI.createLabel({
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		},
		text : data.gifts[0].title,
		color : '#fff',
		bottom : 60,
		textAlign : 'center',
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE
	});
	self.add(self.label);

	self.cf.addEventListener('change', function(_e) {
		self.label.opacity = 0.3;
		self.label.animate(Ti.UI.createAnimation({
			opacity : 1,
			duration : 700
		}));
		self.label.text = images[_e.index].gift.title + ' (' + images[_e.index].gift.price + ' €)';
		self.giftid = images[_e.index].gift.id;
	});
	self.cf.addEventListener('click', linkGift);
	return self;
}
CoverFlow.prototype.show = function() {
	self.show();
	self.darker.show();

}
CoverFlow.prototype.show = function() {
	self.hide();
	self.darker.hide();
}

module.exports = CoverFlow;