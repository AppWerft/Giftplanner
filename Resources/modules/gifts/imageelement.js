exports.create = function(model, gift, actind) {
	function setImage(image) {
		gift.image = image;
		if (self.hint)
			self.hint.hide();
		if (self.dummy)
			self.dummy.animate(Ti.UI.createAnimation({
				opacity : 0,
				duration : 800
			}));
		self.imageview.width = 310;
		self.imageview.height = 310;
		self.imageview.image = image;
		self.imageview.show();
		var photo = Ti.UI.createImageView({
			width : 310,
			height : 310,
			image : image
		});
		gift.image = photo.toImage();
		model.setGift(gift);
		model.setGiftImage(gift);
		var thumbView = Ti.UI.createImageView({
			width : 150,
			height : 150,
			image : image
		});
		gift.thumb = thumbView.toImage();
		model.setThumb(gift);
	};
	var self = require('/modules/parts/icebox').create({
		left : 5,
		height : 310,
		width : 310,
		top : 5,
	});
	self.imageview = Ti.UI.createImageView({
		visible : false,
		width : 310,
		height : 310
	});
	self.add(self.imageview);
	if (gift.image == null) {
		self.dummy = Ti.UI.createImageView({
			image : '/assets/giftdummy.png',
			width : 50,
			height : 50
		});
		self.add(self.dummy);
		self.hint = Ti.UI.createLabel({
			text : L('TAKEIMAGE'),
			bottom : 95,
			height : 20,
			color : 'white'
		});
		self.add(self.hint);
	} else {
		self.imageview.setImage(gift.image);
		self.imageview.visible = true;
	}
	self.addEventListener('click', function() {
		var opts = {
			cancel : 3,
			options : [L('TAKEPHOTO'), L('LIBRARYCHOOSE'), L('WEBQR')],
			title : L('SELECTNEXTSTEP')
		};
		/*	if (gift.image) {
		 opts.destructive = 3;
		 opts.options.push(L('DELETE'));
		 opts.cancel = 4;
		 }*/
		opts.options.push(L('CANCEL'));
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show();
		dialog.addEventListener('click', function(_e) {
			var overlay = Ti.UI.createView({
				bottom : 0,
				height : 100,
				backgroundColor : 'black',
				opacity : 0.7
			});
			overlay.add(Ti.UI.createLabel({
				color : 'white',
				text : L('MAYBEZOOM')
			}));
			switch (_e.index) {
				case 0:
					Ti.Media.showCamera({
						autohide : true,
						success : function(event) {
							var image = require('/modules/parts/squarecropper').crop(event.media);
							setImage(image);
						},
						cancel : function() {
						},
						saveToPhotoGallery : false,
						allowEditing : true,
						mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
					});
					break;
				case 1:
					Ti.Media.openPhotoGallery({
						allowEditing : true,
						success : function(event) {
							var image = require('/modules/parts/squarecropper').crop(event.media);
							setImage(image);
							Ti.Media.hideCamera();
						},
						cancel : function() {
						},
						saveToPhotoGallery : false,

						mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
					});
					break;
				case 2:
					var Barcode = require('ti.barcode');
					Barcode.allowRotation = true;
					Barcode.displayedMessage = '';
					Barcode.useLED = false;
					Barcode.capture({
						animate : false,
						showCancel : true,
						keepOpen : false
					});
					Barcode.addEventListener('success', function(_e) {
						var url = _e.result;
						actind.show();
						actind.message = L('GET') + url;
						var client = Ti.Network.createHTTPClient({
							onload : function(e) {
								setImage(this.responseData);
								actind.hide();
							},
							onerror : function(e) {
							},
							timeout : 15000 // in milliseconds
						});
						client.open("GET", url);
						client.send();
						Barcode.cancel();
					});
					break;
				case 3:
					self.image = null;
					gift.image = null;
					model.setGift('image', gift);
					break;
			}
		});
	});
	return self;
}
