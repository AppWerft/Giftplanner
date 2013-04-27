exports.create = function(g, i) {

	var view = Ti.UI.createView({
		width : 150,
		height : 150,
		gift : g,
		
		left : 7.5 + i % 2 * 155,
		top : 7.5 + Math.floor(i / 2) * 155,
		borderRadius : 6
	});
	if (g.thumb) {
		view.add(Ti.UI.createImageView({
			image : g.thumb,
			width : Ti.UI.FILL,
			defaultImage : '',
			gift : g,
			height : Ti.UI.FILL
		}));
		if (g.user != null) {
			view.add(Ti.UI.createImageView({
				image : '/assets/icon_linked.png',
				left : 5,
				top : 5,
				width : 36,
				height : Ti.UI.SIZE
			}))
		}
	} else {// erstes Bild
		var bg = require('/modules/parts/icebox').create({
			touchEnabled : false,
		});
		
		view.add(bg);
		view.add(Ti.UI.createImageView({
			touchEnabled : false,
			top:47,
			image : '/assets/giftdummy.png',
			width : 32,
			opacity : 1,
			height : 32
		}));

	}
	view.add(Ti.UI.createImageView({
		image : '/assets/titlebar.png',
		width : 150,
		height : 25,
		bottom : 0
	}));
	view.add(Ti.UI.createLabel({
		text : g.title,
		bottom : 3,
		textAlign : 'center',
		color : 'white',
		height : 20,
		left : 5,
		right : 5,
		font : {
			fontSize : 12,
			fontWeight : 'bold'
		}
	}));
	return view;
};
