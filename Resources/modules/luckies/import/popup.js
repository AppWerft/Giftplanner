exports.create = function(model, friends) {
	Array.prototype.in_array = function(needle) {
		for (var i = 0; i < this.length; i++)
			if (this[i] == needle)
				return true;
		return false;
	}
	var self = Ti.UI.createWindow({
		width : '92%',
		height : '92%',
		borderRadius : 10,
		borderWidth : 2,
		backgroundColor : '#3B5998',
		borderColor: 'gray',
		bottom : -500
	});
	self.tv = Ti.UI.createTableView({
		bottom : 50,
		backgroundColor : 'white'
	});
	self.button = Ti.UI.createButton({
		height : 36,
		bottom : 7,
		title : L('IMPORTFRIENDS')
	});
	self.add(self.tv);
	self.add(self.button);
	self.tv.addEventListener('click', function(_e) {
		if (_e.rowData.known == true)
			return null;
		_e.rowData.hasCheck = (_e.rowData.getHasCheck() == true) ? false : true;
	});
	self.open();
	if (!friends) {
		return self;
	}
	var knownfriends = model.getListofKnown();
	var rows = [];
	for (var i = 0; i < friends.length; i++) {
		var f = friends[i];
		var known = knownfriends.in_array(f.id);
		var row = Ti.UI.createTableViewRow({
			friend : f,
			height:60,
			known : known,
			hasCheck : false
		});
		row.add(Ti.UI.createImageView({
			image : f.image,
			left : 0,
			opacity : (known) ? 0.8 : 1,
			width : 60,
			height: 60
		}));
		row.add(Ti.UI.createLabel({
			text : f.name,
			left : 70,
			right : 10,
			opacity : (known) ? 0.4 : 1,
			color : 'black',
			font : {
				fontSize : 17,
				fontWeight : 'bold'
			}
		}));
		rows.push(row);
	}
	self.tv.setData(rows);

	/* Eigentlicher Import */
	self.button.addEventListener('click', function(_e) {
		var luckies = [];
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].hasCheck == true && rows[i].known != true) {
				luckies.push(rows[i].friend);
			}
		}
		/* Event wird in Liste gefangen */
		
		self.fireEvent('selected', {
			luckies : luckies
		});
		self.animate(Ti.UI.createAnimation({
			bottom : -600,
			duration : 700
		}));
	});
	self.animate(Ti.UI.createAnimation({
		bottom : 10,
		duration : 700
	}));
	return self;
}

