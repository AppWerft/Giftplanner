exports.create = function(_title, _info) {
	var self = Ti.UI.createWindow({
		backgroundImage : '/assets/bg.png',
		barColor : '#aa0000',
		title : (_title) ? _title : ''
	});
	var info = Ti.UI.createButton({
		backgroundImage : '/assets/icon_info.png',
		width : 18,
		height : 18
	});

	info.addEventListener('click', function() {
		var win = require('/modules/parts/xmaswindow').create(L('NAVI_IMPRESSUM'));
		win.layout = 'layout';
		var facebook = Ti.UI.createButton({
			backgroundImage : '/assets/facebook.png',
			width : 26,
			height : 26
		});

		win.rightNavButton = facebook;
		win.add(Ti.UI.createImageView({
			image : 'http://www.goldberg-hamilton.com/img/logo_bm.png',
			width : 280,
			top : 30,
			defaultImage : '',

			height : Ti.UI.SIZE
		}));
		win.add(Ti.UI.createLabel({
			top : 90,
			left : 25,
			font : {
				fontSize : 14
			},
			color : 'white',
			text : 'Just like Goldberg & Hamilton GmbH\nJarrestraße 80\n22303 Hamburg\nGermany\n\nTelefon +49 40 / 35 51 32-0\n\ninfo@Goldberg-Hamilton.de\nSitz der Gesellschaft und Registergericht:\nHamburg, HRB 68412\nUmsatzsteuer-ID-Nr.: DE 194935474\nGeschäftsführer: Matthis Teuscher' +
			'\nXmas Gift Planner:\n©2012 Just like Goldberg & Hamilton GmbH'
		}));
		facebook.addEventListener('click', function() {
			facebook.hide();
			var webwin = require('/modules/parts/xmaswindow').create('@Facebook');
			var web = Ti.UI.createWebView({
				url : 'https://www.facebook.com/ChristmasGiftPlanner',
				backgroundColor : 'transparent'
			});
			webwin.addEventListener('close', function() {
				facebook.show();
			});
			webwin.add(web);
			win.tab.open(webwin);
		});
		self.tab.open(win);
	});
	if (_info == true)
		self.leftNavButton = info;

	return self;
}
