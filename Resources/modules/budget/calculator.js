function Calc() {
	return this.init();
}

Calc.prototype.init = function() {
	var self = this;
	var recalcBudget = function() {
		var budget = parseInt(self.budget.value);
		if (isNaN(budget)) budget = 0;
		var total = parseInt(self.total.text);
		if (isNaN(total)) total = 0;
		self.left.setText(budget - total + ',– ');
	}
	this.RIGHT = 140;
	this.LEFT = 200;
	this.FONT = {
		fontSize : 15
	};
	this.BIGFONT = {
		fontSize : 18
	};

	this.container = Ti.UI.createView({
		bottom : 0,
		backgroundColor : 'transparent',
		height : Ti.UI.FILL

	});
	this.container.add(require('/modules/parts/icebox').create({
		height : Ti.UI.FILL,
		left : 10,
		right : 10,
		top : 10,
		bottom : 35
	}));
	this.vcontainer = Ti.UI.createView({
		layout : 'vertical',
		right:15,
		height : Ti.UI.FILL
	});
	this.container.add(this.vcontainer);
	// TOTAL:
	this.totalContainer = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : 15
	});
	this.vcontainer.add(this.totalContainer);
	this.totalContainer.add(Ti.UI.createLabel({
		text : L('TOTALPRICE'),
		color : 'white',
		right : this.RIGHT,
		font : this.FONT,

	}));
	this.total = Ti.UI.createLabel({
		text : '',
		color : 'white',
		right : 5,
		left : this.LEFT,
		font : this.BIGFONT,
		textAlign : 'right',
		width : Ti.UI.FILL
	});
	this.totalContainer.add(this.total);
	// MY BUDGET:
	this.budgetContainer = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : 10,
		bottom : 10
	});
	this.vcontainer.add(this.budgetContainer);
	this.budgetContainer.add(Ti.UI.createLabel({
		text : L('TOTALBUDGET'),
		color : 'white',
		right : this.RIGHT,
		font : this.FONT
	}));
	this.budget = require('/modules/parts/pricekeyboard').get({
		borderRadius : 5,
		width : 100,
		right:4,
		color : 'white',
		height : 28,
		borderWidth : 1,
		font : this.BIGFONT,
		borderColor : 'silver',
		backgroundColor : '#004'
	});
	this.budget.value = (Ti.App.Properties.hasProperty('budget')) ? Ti.App.Properties.getInt('budget') + ',– ': '0.–';
	this.budget.ok.addEventListener('click', function() {
		require('/modules/sound').play('gift_added');
		self.budget.blur();
		Ti.App.Properties.setInt('budget', self.budget.value);
		self.budget.value += ',– '
		recalcBudget();
	});
	this.budgetContainer.add(this.budget);
	
	// LEFT:
	this.leftContainer = Ti.UI.createView({
		height : Ti.UI.SIZE
	});
	this.vcontainer.add(this.leftContainer);
	this.leftContainer.add(Ti.UI.createLabel({
		text : L('LEFTMONEY'),
		color : 'white',
		right : this.RIGHT,
		font : this.FONT
	}));
	this.left = Ti.UI.createLabel({
		text : '0,– ',
		color : 'white',
		left : this.LEFT,
		right : 5,
		font : this.BIGFONT,
		textAlign : 'right',
		width : Ti.UI.FILL
	});
	this.leftContainer.add(this.left);
	
	Ti.App.addEventListener('pricechanged', function(_data) {
		self.total.text = _data.price + ',– ';
		setTimeout(recalcBudget, 300);
	});
	return this;
}
Calc.prototype.getView = function(height) {
	this.container.height = height;
	return this.container;
}

module.exports = Calc;
