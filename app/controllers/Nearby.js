var serviceAgent = require('serviceAgent');
var util = require('util');
var restaurants = Alloy.Collections.restaurants;
restaurants.trigger('change');
var args = arguments[0] || {};

Alloy.Globals.Tracker.trackScreen({
  screenName: "Nearby"
});

function refreshRestaurantSummary(data,append){
	if (_.isNull(data)){
		return;
	}
	var d = JSON.parse(data);
	var models = util.getRestaurantModels(d);
	if (append){
		restaurants.add(models, {silent: true});
		restaurants.trigger('change');
		$.lvSummary.setMarker({sectionIndex:0, itemIndex:(restaurants.length - 1)});
	}else{
		restaurants.reset(models);
	}

	if (restaurants.length == 0){
		$.lblNoResults.setVisible(true);
	}else{
		$.lblNoResults.setVisible(false);
	}
	Alloy.Globals.Loader.hide();
}

function getRestaurantPidList(){
	var ds = [];
	for (var i=0; i < restaurants.length; i++){
		ds.push(restaurants.at(i).get("permitNumber"));
	}
	return ds;
}

function lvSummary_onItemclick(e){
	console.log(e.source);
	var restaurant = restaurants.at(e.itemIndex);
	Alloy.Globals.Loader.show();
	serviceAgent.loadRestaurantDetails(restaurant.get('permitNumber'), function(err, data){
		Alloy.Globals.Loader.hide();
		if (_.isNull(data))
			return;
		var d = JSON.parse(data);
		var view = Alloy.createController('RestaurantDetail',{
			restaurantDetail: d,
			pidList: getRestaurantPidList(),
			currIdx: e.itemIndex
		}).getView();
		view.open();
	});
}
function searchHandler(e){
	Alloy.Globals.Loader.show();
	var searchTerm = $.sbRestaurantSearch.getValue();
	$.sbRestaurantSearch.blur();
	if (searchTerm == '' || searchTerm == null){
		return;
	}
	$.lvSummary.removeEventListener('marker', loadNearbyRestaurants);
	util.getLatLon(function(err, loc){
		serviceAgent.loadRestaurantsByName(searchTerm,loc.lat, loc.lon,0,30,function(err, data){
			Alloy.Globals.Loader.hide();
			if (err != null){
				return;
			}
			refreshRestaurantSummary(data,false);
		});	
	});
}

function sbRestaurantSearch_onChange(){
	if (_.isNull($.sbRestaurantSearch.getValue()) || $.sbRestaurantSearch.getValue() == ''){
		$.sbRestaurantSearch.blur();
	}
}

function loadNearbyRestaurants(){
	var i = restaurants.length;
	console.log(i);
	if (i > 100)
		return;
	Alloy.Globals.Loader.show();
	util.getLatLon(function(err, loc){
		serviceAgent.loadNearbyRestaurants(loc.lat, loc.lon, i, 30, function(err, data){
			if (err != null){
				return;
			}
			refreshRestaurantSummary(data,true);
		});
	});
}

function lblDisclaimer_onClick(){
	Ti.App.Properties.setBool("disclaimerViewed", true);
	Ti.App.fireEvent("seeDisclaimer");
}

function getCity(addrComponents){
	for (var i=0;i<addrComponents.length;i++){
		for (var j=0; j<addrComponents[i].types.length;j++){
			if (addrComponents[i].types[j] == 'locality'){
				return addrComponents[i].long_name;
			}
		}
	}
}

function getState(addrComponents){
	for (var i=0;i<addrComponents.length;i++){
		for (var j=0; j<addrComponents[i].types.length;j++){
			if (addrComponents[i].types[j] == 'administrative_area_level_1'){
				return addrComponents[i].short_name;
			}
		}
	}
}

function init(){
	restaurants.reset([]);
	if (!Ti.App.Properties.hasProperty('disclaimerViewed')){
		$.lblDisclaimer.visible = true;
	}
	$.vSearchContainer.visibleToUser = false;
	
	util.getLatLon(function(err, loc){
		serviceAgent.getGoogleReverseGeo(loc.lat, loc.lon, function(err, res){
			if (err != null || res.results.length <= 0){
				$.lblCurrentLoc.text = "Unknown Location";
				$.lblCurrentLoc.backgroundColor = "#888";
			}
			$.lblCurrentLoc.text = getCity(res.results[0].address_components) + ", " + getState(res.results[0].address_components);
			$.lblCurrentLoc.backgroundColor = "#03A319";
		});
	});
	
	loadNearbyRestaurants();
	
	Ti.App.addEventListener('searchClicked', function(){
		if ($.vSearchContainer.visibleToUser){
			$.vSearchContainer.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,top:-10,duration:200},function(e){
				$.vSearchContainer.visibleToUser = false;
				$.sbRestaurantSearch.blur();
			});
			$.vSummaryView.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN,top:30,duration:200});
		}else{
			$.vSearchContainer.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN,top:30,duration:200},function(e){
				$.vSearchContainer.visibleToUser = true;
				$.sbRestaurantSearch.focus();
			});
			$.vSummaryView.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN,top:70,duration:200});
		}
	});
	Ti.App.addEventListener('hideSearchKeyboard', function(){
		$.sbRestaurantSearch.blur();
	});
	$.lvSummary.addEventListener('marker',loadNearbyRestaurants);
}

init();
