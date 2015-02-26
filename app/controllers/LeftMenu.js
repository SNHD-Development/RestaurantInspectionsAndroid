var args = arguments[0] || {};

function menuItem_TouchStart(e){
	e.source.backgroundColor = '#222';
}

function menuItem_TouchEnd(e){
	e.source.backgroundColor = '#151515';
}

function ivLogo_onClick(){
	Ti.App.fireEvent('menuItemClicked', {
		viewName: 'Nearby',
		title: 'Nearby Restaurants'
	});
}

function menuItem_onClick(e){
	Ti.App.fireEvent('menuItemClicked', {
		viewName: e.source.viewName,
		title: e.source.children[1].text
	});
}

function init(){
	// util.getLatLon(function(err, loc){
        // $.aCurrentLoc.latitude = loc.lat;
	    // $.aCurrentLoc.longitude = loc.lon;
	    // $.aCurrentLoc.title = "Your current location";
	    // $.mapview.region = {latitude:loc.lat, longitude:loc.lon,
            // latitudeDelta:0.01, longitudeDelta:0.01};
        // $.mapview.annotations = [$.aCurrentLoc];	
	// });
}

init();
	