exports.create = function() {
	var self = require('/modules/parts/xmaswindow').create();
	var SCREENHEIGHT = Ti.Platform.displayCaps.platformHeight;
	self.backgroundImage = (SCREENHEIGHT>480) ? '/assets/intro/Default-568h.png' :'/assets/intro/Default.png';
	Ti.API.log(self.backgroundImage);
	self.addEventListener('click', function() {
		self.close();
	});
	self.container = Ti.UI.createView();
	self.add(self.container);
	var images = [];
	for (var i = 1; i < 5; i++) {
		images.push('/assets/intro/santa_pos' + i + '.png');
	}
	var step = 0;
	var planner = Ti.UI.createImageView({
		image:'/assets/intro/txt_gp.png', 
		left:20,
		bottom:120,
		width:300,
		opacity:0
	});
	var xmas = Ti.UI.createImageView({
		image:'/assets/intro/txt_xmas.png',
		 left:0,
		 width:Ti.UI.FILL,
		 height:Ti.UI.SIZE,
		 bottom : 220,
		 opacity : 0
	});
	planner.appear = Ti.UI.createAnimation({opacity:1,duration:900});
	
	var mann = Ti.UI.createImageView({
		image : images[step],
		width : 2000,
		transform : Titanium.UI.create2DMatrix().scale(1.5),
		height : Ti.UI.SIZE,
		anchorPoint : {
			x : 0.5,
			y : 0.5
		},
		center : {
			x : -680,
			y : SCREENHEIGHT +50
		}

	});
	var cron = setInterval(function() {
		step+=1;
		step%=4;
		mann.setImage(images[step]);
	}, 60);	
	self.container.add(mann);
	self.container.add(planner);
	self.container.add(xmas);
	
	mann.flug = Ti.UI.createAnimation({
		center : {
			x : 210,
			y : SCREENHEIGHT - 210
		},
		transform : Titanium.UI.create2DMatrix().scale(0.5),
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 4500
	});
	mann.flug.addEventListener('complete', function() {
		clearInterval(cron);
		xmas.animate(planner.appear);
		setTimeout(function(){planner.animate(planner.appear);},600);
		planner.appear.addEventListener('complete', function() {
			setTimeout(function() {
			self.close({
				transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});},2500);
		});			
	});
	mann.animate(mann.flug);
	require('/modules/sound').play('start_jingle');
	return self;
}