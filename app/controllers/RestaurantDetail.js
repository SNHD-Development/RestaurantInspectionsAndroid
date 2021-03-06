var util = require('util');
var args = arguments[0] || {};
var restaurantDetail = args.restaurantDetail;
var inspections = Alloy.Collections.inspections;
var Map = require('ti.map');
var serviceAgent = require('serviceAgent');

Alloy.Globals.Tracker.trackScreen({
  screenName: "Restaurant Detail"
});

function transformFunction(model){
	var m = model.toJSON();
	var violationsStr = '';
	if (m.violations.length == 0){
		violationsStr = "No violations";
	}else{
		m.violations.forEach(function(violation){
			if (_.isNull(violation) || violation == 'null' || _.isEmpty(violation)){
				return;
			}
			violationsStr = violationsStr + '· ' + violation + '\n';  
		});	
	}
	m.violations = violationsStr;
	return m;
}

function closeWin(){
	$.winRestaurantDetail.animate({
		curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
		opacity:-2 * util.getPlatformWidthDip(),
		transform : Ti.UI.create2DMatrix().scale(1.25),
		duration:300
		}, function(){
		$.winRestaurantDetail.close();	
	});
}

function restaurantDetail_onOpen(){
	Alloy.Globals.Loader.show();
	$.winRestaurantDetail.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,opacity:1,duration:600},
		function(){
			Alloy.Globals.Loader.hide();
		});
}

function init(){
	setupMap();
	$.winRestaurantDetail.title = restaurantDetail.name;
    var ds = [];
    $.tvInspections.height = util.getPlatformHeightDip() - $.vFooter.height - $.mapview.height - 70;
    for (var i=0; i<restaurantDetail.inspections.length; i++){
    	var d = restaurantDetail.inspections[i];
    	if (!d.grade)
			continue;
    	var demerits = d.inspectionDemerits;
    	var inspection = new Backbone.Model({
    		inspectedDate: (new Date(d.inspectionTime)).toLocaleDateString(),
    		grade: d.grade,
    		demerits:  (_.isNull(demerits) || demerits == 0) ? 'No demerits' : d.inspectionDemerits + ' Demerits',
    		gradeColor: util.getGradeColor(d.grade),
    		violations: d.violations
    	});
    	ds.push(inspection);
    }
    inspections.reset(ds);
    inspections.trigger('change');
    var bookmark = getBookmark();
    setBookmarkIcon(bookmark);
}

function setupMap(){
	var addr = restaurantDetail.address + ' ' + restaurantDetail.zipCode;    
    $.aCurrentLoc.latitude = restaurantDetail.latitude;
    $.aCurrentLoc.longitude = restaurantDetail.longitude;
    $.aCurrentLoc.title = restaurantDetail.name;
    $.aCurrentLoc.subtitle = addr;
    $.mapview.region = {latitude:restaurantDetail.latitude, longitude:restaurantDetail.longitude,
        latitudeDelta:0.01, longitudeDelta:0.01};
    $.mapview.annotations = [$.aCurrentLoc];
}

function setBookmarkIcon(bookmark){
	if (bookmark == null || !bookmark.get('Bookmarked')){
		$.ivBookmark.image = '/images/star.png';
		$.lblBookmark.text = 'Bookmark';
	}else{
		$.ivBookmark.image = '/images/star-filled.png';
		$.lblBookmark.text = 'Bookmarked';
	}
}

function getBookmark(){
	var bookmarksCollection = Alloy.createCollection('bookmark');
	bookmarksCollection.fetch({
		query: {
			statement: 'SELECT * FROM bookmarks where RestaurantPermitId = ?',
			params: [restaurantDetail.permitId]
		}
	});
	if (bookmarksCollection.length == 0){
		return null;
	}else{
		return bookmarksCollection.at(0);
	}
}

function vBookmark_onClick(){
	Alloy.Globals.Tracker.trackEvent({
	  category: "UserActions",
	  action: "BookmarkedRestaurant",
	});
	var bookmark = getBookmark();
	if (bookmark == null){
		var bookmark = Alloy.createModel('bookmark',{
			RestaurantPermitId: restaurantDetail.permitId,
			Bookmarked:true
		});
		bookmark.save();
		setBookmarkIcon(bookmark);
	}else{
		bookmark.set('Bookmarked', !bookmark.get('Bookmarked'));
		bookmark.save();
		setBookmarkIcon(bookmark);
	}
}

function vFeedback_onClick(){
	Alloy.Globals.Tracker.trackEvent({
	  category: "UserActions",
	  action: "FeedbackClicked",
	});
	var view = Alloy.createController('Feedback',{
		restaurant: restaurantDetail
	}).getView();
	view.open({modal:true});
}

function addMap(restaurant){
	var addr = restaurantDetail.address + ' ' + restaurantDetail.zipCode;    
	var restaurantAnnotation = Map.createAnnotation({
	    latitude:restaurant.latitude,
	    longitude:restaurant.longitude,
	    title:restaurant.name,
	    subtitle: addr,
	    pincolor:Map.ANNOTATION_RED,
	    myid:1
	});
	
	var mapview = Map.createView({
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:restaurant.latitude, longitude:restaurant.longitude,
	            latitudeDelta:0.01, longitudeDelta:0.01},
	    animate:true,
	    regionFit:true,
    	width: Titanium.UI.FILL,
		height: 180,
	    userLocation:true,
	    annotations:[restaurantAnnotation]
	});
	var d = $.tvInspections.getData();
	var row = Titanium.UI.createTableViewRow();
	row.add(mapview);
	d.unshift(row);
	d.push(Titanium.UI.createTableViewRow({
		backgroundColor: 'transparent'
	}));
	$.tvInspections.setData(d);
}

function vDirections_onClick(){
	Alloy.Globals.Tracker.trackEvent({
	  category: "UserActions",
	  action: "DirectionsClicked",
	});
	Alloy.Globals.Loader.show();
	util.getLatLon(function(err, loc){
		Alloy.Globals.Loader.hide();
		var startLoc = loc.lat + ',' + loc.lon;
		var endLoc = restaurantDetail.address + ' ' + restaurantDetail.zipCode;
		endLoc = endLoc.split(' ').join('+');
		var dirUrl = "https://www.google.com/maps/dir/" + startLoc + "/" + endLoc;
		var view = Alloy.createController('WebView',{url:dirUrl, title: 'Directions'}).getView();
		view.open({modal:true});	
	});
}

function removeNumberAndSlashFromRestaurantName(name){
	var idx = name.indexOf('#');
	if (idx != -1){
		name = name.substr(0, idx);
	}
	idx = name.indexOf('/');
	if (idx != -1){
		name = name.substr(0, idx);
	}
	return name;
}

function IsYelpTopResultAccuratish(name, addr){
	var nameKey = getFirstSignificantKeyword(restaurantDetail.name);
	var addrKey = getFirstSignificantKeyword(restaurantDetail.address);
	return nameKey != '' && addrKey != '' && name.indexOf(nameKey) != -1 && addr.indexOf(addrKey) != -1;
}

function getFirstSignificantKeyword(str){
	var namewords = str.split(' ');
	var key = '';
	for (var i = 0; i< namewords.length; i++){
		if (namewords[i].length > 3){
			return namewords[i];
		}
	}
	return null;
}

function loadNextRestaurant(){
	var nextIdx = args.currIdx + 1;
	if (nextIdx >= args.pidList.length)
		return;
	serviceAgent.loadRestaurantDetails(args.pidList[nextIdx], function(err, data){
		if (_.isNull(data))
			return;
		var d = JSON.parse(data);
		$.tvInspections.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,opacity:0,duration:200});
		var view = Alloy.createController('RestaurantDetail',{
			restaurantDetail: d,
			pidList: args.pidList,
			currIdx: nextIdx
		}).getView();
		view.open();
		setTimeout(function(){
			$.winRestaurantDetail.close();
		}, 500);
	});
}

function loadPrevRestaurant(){
	var prevIdx = args.currIdx - 1;
	if (prevIdx < 0)
		return;
	serviceAgent.loadRestaurantDetails(args.pidList[prevIdx], function(err, data){
		if (_.isNull(data))
			return;
		var d = JSON.parse(data);
		$.tvInspections.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,opacity:0,duration:200});
		var view = Alloy.createController('RestaurantDetail',{
			restaurantDetail: d,
			pidList: args.pidList,
			currIdx: prevIdx
		}).getView();
		view.open();
		setTimeout(function(){
			$.winRestaurantDetail.close();
		}, 500);
	});
}

function trInspection_onSwipe(e){
	if (!args.hasOwnProperty('pidList'))
		return;
		
	Alloy.Globals.Tracker.trackEvent({
	  category: "UserActions",
	  action: "SwipedOnRestaurantDetail",
	});
	if (e.direction == "left"){
		loadNextRestaurant();
	}else if (e.direction == "right"){
		loadPrevRestaurant();
	}
}

function vYelp_onClick(){
	Alloy.Globals.Tracker.trackEvent({
	  category: "UserActions",
	  action: "YelpClicked",
	});
	Alloy.Globals.Loader.show();
	var name = removeNumberAndSlashFromRestaurantName(restaurantDetail.name);
	var address = restaurantDetail.address + ' ' + restaurantDetail.zipCode;
	serviceAgent.getYelpUrl(name, address, function (err, data){
		Alloy.Globals.Loader.hide();
		if ((err != null || data == null || data.total == 0) ||
			!IsYelpTopResultAccuratish(data.businesses[0].name, data.businesses[0].location.address[0])){
			yelpUrl = "http://www.yelp.com/search?find_desc="+ restaurantDetail.name + "&find_loc=" + address;
		}
		var yelpUrl = data.businesses[0].mobile_url;
		var view = Alloy.createController('WebView',{url:yelpUrl, title:'Yelp'}).getView();
		view.open({modal:true});	
	});
}

function winRestaurantDetail_onClose(){
	$.destroy();
}

init();
