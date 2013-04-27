exports.create = function(_data) {
	function updateContent(friend) {
		if (friend) {
			self.height = Ti.UI.SIZE;
			self.image.image = friend.photo;
			self.fullname.text = friend.fullname;
		} else {
			self.height = 0;
		}
		
	}
	var self = Ti.UI.createView({
		height : ((_data.gift.user) ? Ti.UI.SIZE :0)
	});
	self.box = require('/modules/parts/icebox').create({
		left : 100,
		height :  40,
		top : 8,
		bottom : 2,
		right : 7
	});
	self.image = Ti.UI.createImageView({
		image : (_data.gift.user) ? _data.gift.user.photo : null,
		width : 40,
		borderRadius:5,
		left:0,
		height : 40
	});
	self.box.add(self.image);
	self.fullname = Ti.UI.createLabel({
		text : (_data.gift.user)  ? _data.gift.user.fullname :'',
		left : 50,
		color:'white',
		height : 30,
		width: Ti.UI.FILL
	});
	
	self.box.add(self.fullname);
	self.add(Ti.UI.createLabel({
		text : _data.label,
		right : 235,
		top : 15,
		height : 16,
		textAlign : 'right',
		width : Ti.UI.FILL,
		color : '#fff',
		font : {
			fontSize : 14
		}
	}));
	self.add(self.box);
	Ti.App.addEventListener('gifttotalchanged',function(){
		var res = _data.model.getAllGifts(_data.gift.id);
		console.log(res);
		updateContent(res.user);
	});
	/*Ti.App.addEventListener('gift:linked',function(_e){
		if (_e.gift.id == _data.gift.id) {
			console.log(_e.friend);
			updateContent(_e.friend);
		} 
	});*/
	return self;
}
