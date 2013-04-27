exports.get = function(_options, _callback) {
	function getFacebookFriends() {
		Ti.Facebook.requestWithGraphPath('me/friends', {}, 'GET', function(_fb) {
			if (_fb.success) {
				var result = JSON.parse(_fb.result);
				var friends = result.data;
				for (var i = 0; i < friends.length; i++) {
					var id = friends[i].id;
					friends[i].image = 'https://graph.facebook.com/' + id + '/picture';
				}
				_callback(friends);
			} else {
				Ti.API.log('ERROR in Facebookrequest');
				_callback(null);
			}
		});
	}
	Ti.Facebook.appid = '202972656504444';
	Ti.Facebook.permissions = ['read_friendlists', 'user_likes', 'friends_likes'];
	if (Ti.Facebook.loggedIn == false) {
		Ti.Facebook.authorize();
		Ti.Facebook.addEventListener('login', function(_e) {
			Ti.API.log(_e);
			if (_e.success == true) {
				getFacebookFriends();
			} else {
				_callback(null);
			}
		});
	} else
		getFacebookFriends();
};
