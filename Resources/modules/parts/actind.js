exports.create = function(message) {
	var px = 2.3;
	if (!message)
		message = 'Hole Daten …';
	var actInd = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : 'black',
		borderRadius : 10,
		width : 85 * px,
		height : 35 * px,
		opacity : 0.8,
		zIndex : 999,
		font : {
			fontSize : 4.5 * px
		},
		borderColor : 'white',
		borderWidth : 2,
		zIndex : 999,
		message : message
	});
	return actInd;
}
