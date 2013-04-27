function createBox2D(container) {
	var BOX2D = require('ti.box2d');
	var world = BOX2D.createWorld(container);
	var wall = {
		density : 12.0,
		friction : 0.3,
		restitution : 0.4,
		type : "static"
	};
	world.leftWall = world.addBody(Ti.UI.createView({
		backgroundColor : "transparent",
		width : 2,
		left : 0,
		height : 840,
		bottom : 0
	}), wall);
	world.rightWall = world.addBody(Ti.UI.createView({
		backgroundColor : "transparent",
		width : 1,
		right : 0,
		height : 840,
		bottom : 0
	}), wall);
	world.topWall = world.addBody(Ti.UI.createView({
		backgroundColor : "transparent",
		width : 700,
		height : 2,
		top : -500
	}), wall);
	world.bottomWall = world.addBody(Ti.UI.createView({
		backgroundColor : "transparent",
		width : 700,
		height : 1,
		bottom : 0,
	}), wall);
	for (var i = 1; i < 40; i++) {
		var left = 320 * Math.random();
		var top = -Math.random() * 20;
		var width = 6 + Math.random() * 13;
		world.addBody(Ti.UI.createImageView({
			left : left,
			width : width,
			height : width,
			top : top,
			opacity : 0.9,
			image : '/assets/snow1.png'
		}), {
			density : width * 0.05,
			friction : width * 0.05,
			restitution : width * 0.05,
			type : "dynamic"
		});
	}
	world.setGravity(0, -2);
	Ti.Gesture.addEventListener('orientationchange', function(e) {
		if (e.orientation == Ti.UI.LANDSCAPE_LEFT) {
			world.setGravity(0.5, 0);
		} else if (e.orientation == Ti.UI.LANDSCAPE_RIGHT) {
			world.setGravity(-0.5, 0);
		} else if (e.orientation == Ti.UI.UPSIDE_PORTRAIT) {
			world.setGravity(0, 0.5);
		} else if (e.orientation == Ti.UI.PORTRAIT) {
			world.setGravity(0, -0.5);
		}
	});
	world.start();
}

