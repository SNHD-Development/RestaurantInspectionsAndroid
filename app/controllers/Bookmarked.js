var serviceAgent = require('serviceAgent');
var util = require('util');
var restaurants = Alloy.Collections.restaurants;
restaurants.trigger('change');
var args = arguments[0] || {};

Alloy.Globals.Tracker.trackScreen({
  screenName: "Bookmarked"
});

function getBookmarkedRestaurantPnums(){
	var bookmarksCollection = Alloy.createCollection('bookmark');
	bookmarksCollection.fetch({
		query: {
			statement: 'SELECT * FROM bookmarks where Bookmarked = ?',
			params: [true]
		}
	});
	var pnums = [];
	bookmarksCollection.forEach(function(bookmark){
		pnums.push(bookmark.get('RestaurantPermitId'));
	});
	return pnums.join();
}

function refreshRestaurantSummary(data){
	if (_.isNull(data)){
		return;
	}
	var d = JSON.parse(data);
	if (d.length == 0){
		$.lblNoResults.setVisible(true);			
	}else{
		$.lblNoResults.setVisible(false);
	}
	var models = util.getRestaurantModels(d);
	restaurants.reset(models);
}

function lvSummary_onItemclick(e){
	Alloy.Globals.Loader.show();
	var restaurant = restaurants.at(e.itemIndex);
	serviceAgent.loadRestaurantDetails(restaurant.get('permitNumber'), function(err, data){
		Alloy.Globals.Loader.hide();
		if (_.isNull(data))
			return;
		var d = JSON.parse(data);
		var view = Alloy.createController('RestaurantDetail',{
			restaurantDetail: d
		}).getView();
		view.open({modal:true});
	});
}

function init(){
	Alloy.Globals.Loader.show();
	var pnums = getBookmarkedRestaurantPnums();
	if (pnums == ''){
		$.lblNoResults.setVisible(true);	
		restaurants.reset([]);
		Alloy.Globals.Loader.hide();
		return;
	}
	util.getLatLon(function(err, loc){
		serviceAgent.loadBookmarkedRestaurants(pnums, loc.lat, loc.lon, function (err, data){
			if (err != null){
				return;
			}
			refreshRestaurantSummary(data);
			Alloy.Globals.Loader.hide();
		});
	});
}

init();

