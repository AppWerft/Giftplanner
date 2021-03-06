exports.create = function(model, friend, parent) {
	/*
	 * kompletter Streifen
	 */
	var GIFTWIDTH = parseInt(parent.RIGHT) - 80;
	var self = Ti.UI.createTableViewRow({

	});
	self.add(Ti.UI.createLabel({
		right : parent.RIGHT,
		color : 'white',
		text : L('GIFTIDEA'),
		font : {
			fontSize : parent.FONTSIZE
		},
		top : 5
	}));
	self.bg = Ti.UI.createView({
		backgroundGradient : {
			type : 'linear',
			colors : ['#999', '#111'],
			startPoint : {
				x : 0,
				y : 0
			},
			endPoint : {
				x : 0,
				y : parent.RIGHT - 20
			},
			backFillStart : false
		},
		opacity : 0.36,
		left : parent.LEFT,
		top : 5,
		height : GIFTWIDTH,
		width : GIFTWIDTH,
		borderRadius : 10
	});
	self.add(self.bg);
	var container = Ti.UI.createView({
		left : parent.LEFT,
		top : 5,
		bottom : 5,
		height : GIFTWIDTH,
		width : GIFTWIDTH,
		borderRadius : 10,

	});
	self.add(container);

	var giftView = Ti.UI.createImageView({
		image : '/assets/giftdummy.png',
		width : 32,
		height : 32,
		touchEnabled : false
	});

	giftView.addEventListener('setimage', function(_data) {
		var image = ( typeof (_data.image) == 'string') ? _data.image : _data.image.image;
		giftView.setWidth(GIFTWIDTH);
		giftView.setHeight(GIFTWIDTH);
		giftView.setImage(image);
		
	});
	var pb = Ti.UI.createProgressBar({
		width : 150,
		min : 0,
		max : 100,
		value : 1,
		bottom : 10,
		height : 10,
		style : Ti.UI.iPhone.ProgressBarStyle.PLAIN
	});
	/*
	 *  Bildkasten füllen:
	 */
	if (friend.giftphoto) {
		/*
		 Bild schon gewählt: hinmalen
		 */
		giftView.fireEvent('setimage', {
			image : friend.giftphoto
		});
	} else {
		// Coverflow vorbereiten:
		var CF = require('/modules/luckies/giftscoverflow');
		setTimeout(function() {
			self.coverFlow = new CF(model, pb, friend);
			parent.add(self.coverFlow);
		}, 100);
		parent.addEventListener('close', function() {
			self = null;
		});
		container.add(pb);
		pb.show();
		container.add(Ti.UI.createLabel({
			bottom : 30,
			height : 20,
			font : {
				fontSize : parent.FONTSIZE
			},
			text : L('CHOOSEGIFT'),
			color : 'silver'
		}));
	}
	container.add(giftView);

	container.addEventListener('click', function() {
		if (!friend.giftphoto && self.coverFlow)
			self.coverFlow.show();
	});
	Ti.App.addEventListener('friend:choosegift!',function(){
		if (!friend.giftphoto && self.coverFlow)
			self.coverFlow.show();
	});

	Ti.App.addEventListener('gift:linked', function(_data) {
		friend.giftphoto = _data.gift.image;
		giftView.setWidth(GIFTWIDTH);
		giftView.setHeight(GIFTWIDTH);
		giftView.setImage(_data.gift.image);
		friend.status = 1;
	});
	Ti.App.addEventListener('gift:unlinked', function(_data) {
		friend.status = 0;
		friend.giftphoto = null;
		giftView.width = 32;
		giftView.height = 32;
		giftView.image = '/assets/giftdummy.png';
	});
	return self;
}
