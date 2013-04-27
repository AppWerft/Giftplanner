exports.create = function(model, friend, parent) {
	var self = Ti.UI.createTableViewRow({
		height : 60
	});

	if (Ti.Network.online) {
		self.actind = Ti.UI.createActivityIndicator({
			style : Ti.UI.iPhone.ActivityIndicatorStyle.BIG
		});
		self.actind.show();
	} else {
		self.actind = Ti.UI.createLabel({
			text : L('NOFB_MSG'),
			color: 'white'
		})
	}
	setTimeout(function() {
		self.actind.hide();
	}, 3000);
	self.add(self.actind);

	require('/modules/luckies/facebooklikes_window').create(model, friend, parent, function(facebooklikeswindow) {
		if (facebooklikeswindow != null) {
			self.remove(self.actind);
			self.add(Ti.UI.createLabel({
				right : parent.RIGHT,
				color : 'white',
				text : 'Likes',
				font : {
					fontSize : parent.FONTSIZE
				},
				top : 0,
				height : 40
			}));
			self.add(Ti.UI.createView({
				backgroundGradient : {
					type : 'linear',
					colors : ['#999', '#111'],
					startPoint : {
						x : 0,
						y : 0
					},
					endPoint : {
						x : 0,
						y : 60
					},
					backFillStart : false
				},
				opacity : 0.36,
				left : parent.LEFT,
				top : 10,
				height : 50,
				borderRadius : 10,
				right : 10
			}));
			self.fbbutton = Ti.UI.createButton({
				backgroundImage : '/assets/fb.png',
				left : parent.LEFT + 20,
				width : 40,
				height : 30,
				enableTouch : false
			});
			self.add(Ti.UI.createLabel({
				text : L('INLIKES'),
				color : 'white',
				bottom : 15,
				height : 20,
				left : parent.LEFT + 70,
				font : {
					fontWeight : 'normal'
				}
			}));
			self.addEventListener('click', function() {
				parent.tab.open(facebooklikeswindow);
			});
			self.add(self.fbbutton);
		} else {

		}
	});
	return self;
}
