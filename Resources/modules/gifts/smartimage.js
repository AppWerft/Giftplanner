exports.getratio = function(_image, _parent, _callback) {
	var testImg = Ti.UI.createImageView({
		image : _image,
		height : Ti.UI.FILL,
		width : Ti.UI.SIZE || 'auto'
	});
	var testcontainer = Ti.UI.createScrollView({
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.SIZE,
		visible : false
	});
	_parent.add(testcontainer);
	testcontainer.add(testImg);
	var self = this;
	testImg.addEventListener('postlayout', function(_e) {
		if (!testImg)
			return;
		var ratio = _e.source.getSize().width / _e.source.getSize().height;
		Ti.API.log(_e.source.getSize().width);
		Ti.API.log(_e.source.getSize().height);
		_parent.remove(testcontainer);
		_callback(ratio);
		testImg = null;
	});
};
