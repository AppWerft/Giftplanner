exports.create = function(model) {
	var introWindow = require('/modules/intro').create();
	
	
	var win1 = require('/modules/gifts/list').create(model);

	var tabGroup = Titanium.UI.createTabGroup();
	var tab1 = Titanium.UI.createTab({
		icon : '/assets/icon_gift.png',
		title : L('NAVI_GIFTIDEAS'),
		window : win1,
		badge : null
	});
	tabGroup.addTab(tab1);
	var tab2 = Titanium.UI.createTab({
		icon : '/assets/icon_luckys.png',
		title : L('NAVI_LUCKIES'),
		window : require('/modules/luckies/list').create(model)
	});
	tabGroup.addTab(tab2);
	var tab3 = Titanium.UI.createTab({
		icon : '/assets/icon_money.png',
		title : L('NAVI_BUDGET'),
		window : require('/modules/budget/list').create(model)
	});
	tabGroup.addTab(tab3);
	tabGroup.addEventListener('focus', function(_e) {
		var sounds = ['gallery', 'luckies', 'budget'];
		require('/modules/sound').play(sounds[_e.index]);
	})
	introWindow.addEventListener('close', function() {
		introWindow = null;
		/*
		 var snow = Ti.UI.createView({
		 bottom : 50
		 });
		 tabGroup.add(snow);

		 var box2dactive = false;
		 if (box2dactive)
		 return;
		 createBox2D(snow);
		 box2dactive = true;
		 */
		tabGroup.add(Ti.UI.createImageView({
			bottom : 48,
			zIndex : 9999,
			image : '/assets/footer.png',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL
		}));
		tabGroup.open();
		//require('help').create(model.getAllGifts().gifts.length);
	});
	var setGreenBadge = function(_total) {
		if (tabGroup.badge)
			tabGroup.remove(tabGroup.badge);
		if (_total != null && _total > 0) {

			var image = (_total < 10) ? '/assets/icon_badge.png' : '/assets/icon_dbadge.png';
			var width = (_total < 10) ? 18 : 25;
			tabGroup.badge = Ti.UI.createView({
				//image : image,
				backgroundColor : '#080',
				borderRadius : 8,
				borderColor : 'white',
				borderWidth : 1.5,
				bottom : 24,
				left : 63,
				width : width,
				height : 18

			});
			tabGroup.badge.add(Ti.UI.createLabel({
				color : 'white',
				font : {
					fontSize : 12,
					fontWeight : 'bold'
				},
				text : _total
			}));
			tabGroup.add(tabGroup.badge);
		}
	};
	Ti.UI.iPhone.hideStatusBar();
	introWindow.open();
	Ti.App.addEventListener('gifttotalchanged', function(_e) {
		setGreenBadge(_e.total);
	});
	
	
}
