exports.create = function(_model, _friend, _parent, _callback) {
	var id = _friend.id;
	var self = require('/modules/parts/xmaswindow').create('Facebook Likes');
	self.add(require('/modules/luckies/lucky_userstrip').create(_model, _friend, _parent));
	/* holt Likes einer User_ID */
	require('/modules/luckies/facebooklikes_model').get(id, function(data) {
		if (data != null) {
			var cats = data.catlist;
			// Anzeige
			var piedata = data.piedata;
			// für Torte
			var rightButton = Ti.UI.createButton({
				backgroundImage : '/assets/pie.png',
				width : 32,
				height : 32
			});
			self.rightNavButton = rightButton;
			var win = require('/modules/parts/xmaswindow').create('Pie');
			win.add(require('/modules/luckies/lucky_userstrip').create(_model, _friend, _parent));
			;
			win.title = 'FB Likes Pie';
			win.web = Ti.UI.createWebView({
				disableBounce : true,
				url : '/html/index.html',
				top : 100,
				bottom : -10,
				backgroundColor : 'transparent'
			});
			win.add(win.web);
			win.web.addEventListener('load', function() {
				win.web.evalJS("options.series[0].data = " + JSON.stringify(piedata) + ";chart = new Highcharts.Chart(options);");
			});

			rightButton.addEventListener('click', function() {
				self.tab.open(win);
			});
			var fbliste = Ti.UI.createTableView({
				borderRadius : 5,
				top : 100,
				backgroundColor : 'transparent',
				height : Ti.UI.FILL
			});
			var sections = [];
			for (var cat in cats) {
				var headerView = Ti.UI.createView({
					height : 20,
					backgroundColor : '#3B5998'
				});
				headerView.add(Ti.UI.createLabel({
					text : cat,
					textAlign : 'left',
					left : 10,
					font : {
						fontSize : 12
					},
					color : 'white'
				}));
				var section = Ti.UI.createTableViewSection({
					headerView : headerView
				});
				for (var i = 0; i < cats[cat].length; i++) {
					var name = cats[cat][i];
					var row = Ti.UI.createTableViewRow({
						backgroundColor : 'white',
						label : name
					});
					
					row.add(Ti.UI.createLabel({
						text : name,
						left : 5,
						right : 5,
						font : {
							fontSize : 17
						},
						width : Ti.UI.FILL
					}));
					section.add(row);
				}
				sections.push(section);
			}
			fbliste.setData(sections);
			self.add(fbliste);
			fbliste.addEventListener('click',function(_e){
				var win =require('/modules/parts/xmaswindow').create('');
				win.title = 'Google'; 
				var web = Ti.UI.createWebView({backgroundColor:'transparent',url:'http://google.com/search?q='+ _e.rowData.label});
				win.add(web);
				self.tab.open(win);	
			});
			_callback(self);
		} else
			_callback(null);
	});
}
