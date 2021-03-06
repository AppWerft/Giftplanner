var Model = function() {
	return this.init();
}

function LG(x) {} 

var IMGCACHE = 'IMGCACHE';

Model.prototype.init = function() {
	this.DB = Ti.Database.open('giftplanner14');
	this.DB.execute('CREATE TABLE IF NOT EXISTS bescherung (userid TEXT, giftid TEXT, UNIQUE (userid, giftid))');
	this.DB.execute('CREATE TABLE IF NOT EXISTS gifts (id INTEGER PRIMARY KEY,status TEXT,description TEXT,title TEXT,price INTEGER, image TEXT);');
	this.DB.execute('CREATE TABLE IF NOT EXISTS users (status INTEGER,skype TEXT,image TEXT,id TEXT PRIMARY KEY,fullName TEXT,nickname TEXT, birthday TEXT, email TEXT, address TEXT, phone TEXT, datum TEXT, url TEXT);');
	LG(this.DB.file);
	var self = this;
	setTimeout(function(){self.getAllFreeGifts();},1000);

	return this;
}


Model.prototype.getAllGifts = function(id) {
	var resultSet = this.DB.execute("SELECT * FROM gifts WHERE status IS NULL");
	if (resultSet.rowCount == 0) {
		var sql = "INSERT INTO gifts VALUES (NULL,NULL,NULL,NULL,NULL,NULL)";
		this.DB.execute(sql);
		LG('NEW EMPTY GIFT');
		Ti.App.fireEvent('app:newgift');
	}
	resultSet.close();
	resultSet = this.DB.execute('SELECT gifts.status,gifts.description,gifts.id giftid, gifts.title gifttitle, gifts.price, users.fullname, users.image photo, users.id userid FROM gifts LEFT JOIN bescherung ON bescherung.giftid=gifts.id LEFT JOIN users ON bescherung.userid = users.id ORDER BY giftid DESC');
	var gifts = [];
	var price = 0;
	while (resultSet.isValidRow()) {
		//var id = resultSet.fieldByName('giftid');
		var user = (resultSet.fieldByName('userid')) 
		?	{
				id:resultSet.fieldByName('userid'),
				fullname:resultSet.fieldByName('fullname'),
				photo:resultSet.fieldByName('photo')  
			}
		: null;
		var gift = {
			title : resultSet.fieldByName('gifttitle'),
			id : resultSet.fieldByName('giftid'),
			description: resultSet.fieldByName('description'),
			status : resultSet.fieldByName('status'),
			price : resultSet.fieldByName('price') || '0',
			user  : user
		};
		price += parseInt(gift.price);
		var t = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'thumbs', gift.id + '.png');
		gift.thumb = (t.exists()) ? t.nativePath : null;
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'IMGCACHE', gift.id + '.png');
		gift.image = (f.exists()) ? f.nativePath : null;
	
		if (gift.title === null) {
			gift.title = 'Gift №'+ gift.id;
		}
		if (gift.status === null) {
			gift.image = null;
			gift.thumb = null;
			gift.title = 'New idea';
		}
		if (id && id == gift.id) {
			return gift;
		}
		gifts.push(gift); 
		resultSet.next();
	}
	resultSet.close();
	return {gifts:gifts,price:price};
}

Model.prototype.getAllFreeGifts = function() {
	var data = this.getAllGifts();
	var gifts = [];
	for (var i=0;i<data.gifts.length;i++) {
		var gift = data.gifts[i];
		if (gift.user == null && gift.status != null) {
			gifts.push(data.gifts[i]);
		}
	}
	Ti.App.fireEvent('gifttotalchanged',{total:gifts.length});
	return {gifts:gifts,count:gifts.length};
}


Model.prototype.deleteFriend = function(friend) {
	this.DB.execute('DELETE FROM bescherung WHERE userid="'+friend.id+'"'); 
	this.DB.execute('DELETE FROM users  WHERE id="'+friend.id+'"'); 
	Ti.App.fireEvent('app:usermodified',{});
};

Model.prototype.deleteGift = function(gift,_callback) {
	var self = this;
	var dialog = Ti.UI.createAlertDialog({
    	cancel: 1,
    	buttonNames: ['OK', L('CANCEL')],
    	message: (gift.user) ? String.format(L('ENTGIFTUNG_MSG'),gift.user.fullname) :  L('GIFTWEG_MSG'),
    	title:  (gift.user) ? L('ENTGIFTUNG_TITLE') : L('GIFTWEG_TITLE')
  	});
  	dialog.addEventListener('click', function(e){
 	   	if (e.index === e.source.cancel) {
   			_callback(null);
   			return;
    	}
    	if (gift.user) {
			self.DB.execute('UPDATE users set status=0 WHERE id="'+gift.user.id+'"'); 
    		self.DB.execute('DELETE FROM bescherung WHERE giftid="'+gift.id+'"'); 
    		Ti.App.fireEvent('gift:unlinked',{friend:gift.user});
    		Ti.App.fireEvent('app:usermodified',{});
    	}
    	self.DB.execute('DELETE FROM gifts WHERE id="'+gift.id+'"'); 
		if (gift.image) {
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'IMGCACHE', gift.id + '.png');
			if(f.exists() && f.writeable) {
    			f.deleteFile();
    		}
		}
	 	
   	Ti.App.fireEvent('app:giftmodified',{});
		_callback(true);
  	});
	dialog.show();
};


Model.prototype.unlinkGiftFromFriend = function(friend) {
	var sql = [	'BEGIN IMMEDIATE TRANSACTION',
				'DELETE FROM bescherung WHERE userid="' + friend.id + '"',
				'UPDATE users SET status=0 WHERE id="'+friend.id+'"',
				'COMMIT TRANSACTION'];
	LG(sql);
	try {
	for (var i=0; i<sql.length;i++) {
			this.DB.execute(sql[i]); 
	}} catch(E) {LG(E);}
	
		Ti.App.fireEvent('app:usermodified',{});
		Ti.App.fireEvent('gift:unlinked',{   // ==>  modules/luckies/lucky_gift.js
			friend:friend
	});
	this.getAllFreeGifts();
}


Model.prototype.linkGift2Friend = function(options) {
	LG('linkGift2Friend');
	var sql = [	'BEGIN IMMEDIATE TRANSACTION',
				'INSERT INTO bescherung (userid,giftid) VALUES ("'+options.friend+'",'+options.gift+')',
				'UPDATE users SET status=1 WHERE id="'+options.friend+'"',
				'COMMIT TRANSACTION'];
	LG(sql);
	try {
	for (var i=0; i<sql.length;i++) {
			this.DB.execute(sql[i]); 
	}} catch(E) {LG(E);}
	
	var resultSet = this.DB.execute("SELECT fullname,image FROM users WHERE id="+ options.friend);
	if (resultSet.rowCount > 0) {
		var friend = {
			fullname: resultSet.fieldByName('fullname'),
			image :  resultSet.fieldByName('image')
		}; 
		resultSet.close();
	}
	var gift  = this.getGift(options.gift);
	LG(gift);
		Ti.App.fireEvent('gift:linked',{   // ==>  modules/luckies/lucky_gift.js
			gift : gift,
			friend : friend
	});
	this.getAllFreeGifts();
	Ti.App.fireEvent('app:usermodified');  //===> modules/luckies/list.js, modules/luckies/lucky_status.js
}

Model.prototype.setStatusByFriend = function(id,status) {
	this.DB.execute('UPDATE users SET status=' + status + ' WHERE id="' + id+'"');  
}

Model.prototype.getStatusByFriend = function(id) {
	var pngs = ['ggg','bgg','bbg','bbb'];
	var rs = this.DB.execute('SELECT status FROM  users  WHERE id="' + id+'"');  
	var status = rs.fieldByName('status');
	var statusObj = {status:status, png:'/assets/status/ic_'+ pngs[status%4] +'.png'};
	rs.close();
	return statusObj;
};

Model.prototype.setFriends = function(friends) {
	//this.DB.execute('BEGIN TRANSACTION');
	for (var i=0;i<friends.length;i++) {
		var friend = friends[i];
		try {
		if (friend.image) {
			if (typeof(friend.image )!= 'string') {
				var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'friends');
				if (!g.exists()) 
					g.createDirectory();
				var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'friends', friend.id + '.png');
				f.write(friend.image);
				friend.image = f.nativePath;	
			}
			this.DB.execute('INSERT INTO users (id,fullName,image) VALUES ("'+friend.id+'","'+friend.name+'","'+friend.image+'")');
		} else {
			this.DB.execute('INSERT INTO users (id,fullName) VALUES  ("'+friend.id+'","'+friend.name+'")');
		}
		require('/modules/sound').play('lucky_added');
		} catch(E) {}
	}
	Ti.App.fireEvent('app:usermodified',{});
	//this.DB.execute('COMMIT');
	
}

Model.prototype.getGift = function(id) {
	var resultSet = this.DB.execute("SELECT * FROM gifts WHERE id=" + id);
	var gift = {
		id : id,
		title : resultSet.fieldByName('title') || 'Gift №'+ id,
		status : resultSet.fieldByName('status'),
		image : resultSet.fieldByName('image')
	};
	resultSet.close();
	return gift;
}

Model.prototype.setGift = function(gift,key) {
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'IMGCACHE');
		if (!g.exists()) {
			g.createDirectory();
		};
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'IMGCACHE', gift.id + '.jpg');
	if (gift.image == null) {
		if(f.exists() && f.writeable) {
    		var sql= 'UPDATE gifts SET image=NULL  WHERE id=' + gift.id;
    		LG(sql);
    		LG('Delete Gift in setGift');
			this.DB.execute(sql);
    		//f.deleteFile();
    	}	
	} else {
		if (typeof(gift.image) != 'string') { 
			LG('UPDATE GIFT in setGift()');
			f.write(gift.image);
		}
		var sql = 'UPDATE gifts SET status = 1, image="'+ f.nativePath+'" WHERE id=' + gift.id;
		LG(sql);
		var resultSet = this.DB.execute(sql);
	}
	if (key) {
		this.getAllFreeGifts();
		var sql= 'UPDATE gifts SET ' + key + '="' + gift[key] + '", status=1 WHERE id=' + gift.id;
		LG(sql);
		this.DB.execute(sql);
	}
}

Model.prototype.setThumb = function(gift) {
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'thumbs');
		if (!g.exists()) {
			g.createDirectory();
		};	
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'thumbs', gift.id + '.png');
	if (gift.thumb == null) {
		if(f.exists() && f.writeable) {
			L('Delete thumb in setThumb()');
    		//f.deleteFile();
    	}	
	} else {
		f.write(gift.thumb);
		LG('Update Thumb in setThumb');
	}
}
Model.prototype.setGiftImage = function(gift) {
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'IMGCACHE');
		if (!g.exists()) {
			g.createDirectory();
		};	
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'IMGCACHE', gift.id + '.png');
	if (gift.image == null) {
		if(f.exists() && f.writeable) {
    		//f.deleteFile();
    	}	
	} else {
		f.write(gift.image);
	}
}


Model.prototype.getFriendByGift = function(id) {
	var resultSet = this.DB.execute("SELECT userid AS id FROM bescherung WHERE giftid="+ id);
	if (resultSet.rowCount > 0) {
		return resultSet.fieldByName('id'),
		resultSet.close();
	} 
	resultSet.close();
	return null;
}

Model.prototype.getGiftByFriend = function(id) {
	var resultSet = this.DB.execute('SELECT giftid AS id FROM bescherung WHERE userid="'+ id + '"');
	if (resultSet.rowCount > 0) {
		return this.getGift(resultSet.fieldByName('id')),
		resultSet.close();
	} 
	resultSet.close();
	return null;
}


Model.prototype.getListofKnown = function() {
	var friends = this.getAllLuckiesPreview();
	var list = [];
	for (var i=0;i<friends.length;i++) {
		list.push(friends[i].id);
	}
	return list;
}

Model.prototype.getStatusByFriend = function(id) {
	var pngs = ['ggg','bgg','bbg','bbb'];
	var rs = this.DB.execute('SELECT status FROM  users  WHERE id="' + id+'"');  
	var status = rs.fieldByName('status');
	var statusObj = {status:status, png:'/assets/status/ic_'+ pngs[status%4] +'.png'};
	rs.close();
	return statusObj;
};


Model.prototype.updateFriendStatus = function(friend) {
	var pngs = ['ggg','bgg','bbg','bbb'];
	if (friend.status == 0) return null;
	var status = (friend.status+1)%4;
	if (friend.status ==0) {
		var sql = 'DELETE FROM bescherung WHERE userid="' + friend.id+'"';  
		this.DB.execute(sql);
	}
	var sql = 'UPDATE users  SET status=' + status + ' WHERE id="' + friend.id+'"';  
	this.DB.execute(sql);
	var statusObj = {
		close : false, 
		status : status, 
		png : '/assets/status/ic_'+ pngs[status] +'.png'
	};
	if (status == 0) {
		this.unlinkGiftFromFriend(friend);
		statusObj.close = true;
	}
	Ti.App.fireEvent('app:usermodified',{});
	return statusObj;	
}

Model.prototype.getAllLuckiesPreview = function() {
	resultSet = this.DB.execute(
	  'SELECT users.status status, users.id userid,users.fullname fullname,users.image userphoto,bescherung.giftid giftid,gifts.image giftphoto '
	+ 'FROM users '
	+ 'LEFT JOIN bescherung ON bescherung.userid=users.id LEFT JOIN gifts ON bescherung.giftid = gifts.id');
	var luckies = [];
	while (resultSet.isValidRow()) {
		var id = resultSet.fieldByName('userid');
		var fb = (id>100000) ? true : false;
		var lucky = {
			fullname : resultSet.fieldByName('fullname'),
			id : id,
			giftid : resultSet.fieldByName('giftid'),
			giftphoto: resultSet.fieldByName('giftphoto'),
			status: resultSet.fieldByName('status'),
			fb : fb,
			image : resultSet.fieldByName('userphoto')
		};
		resultSet.next();
		luckies.push(lucky);
	}
	resultSet.close();
	return luckies;
}

module.exports = Model;
