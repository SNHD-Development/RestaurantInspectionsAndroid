var jsOAuth = require ('jsOAuth');

function getAuthHeader(){
	var username = "SnhdRestaurantInspectionUser";
	var password = "V1eGYQ8Bjy4WJkE";
	var credentials = username + ':' + password;
	var authHeaderValue = 'Basic ' + Ti.Utils.base64encode(credentials);
	return authHeaderValue;
}

// function checkNetworkConnectivity(){
	// if (Ti.Network.getNetworkType() == Ti.Network.NETWORK_NONE &&
		// Ti.App.Properties.getBool("NetworkConnectivityWarningDisplayed" == false)){
		// Ti.App.Properties.setBool("NetworkConnectivityWarningDisplayed", true);
		// alert('No network connection is available. App may not function correctly.');
	// }
// }

exports.getYelpUrl = function (restaurantName, restaurantLocation, cb){
	//checkNetworkConnectivity();
	if (ENV_DEVELOPMENT){
		cb(null,getMockYelpData());
		return;
	}
	
	var oauth = jsOAuth.OAuth({
	    consumerKey: "a8Btxif0dd8Xyg9lDz4Ytg",
	    consumerSecret: "Q2-3nwXuX2hIbGp20C-2sh9gmN0",
	    accessTokenKey: "dvudMVOUu1x0zWn6awWgOEnlugQCAOf7",
	    accessTokenSecret:"mJWvr0F_tv7vqhS43_Dh9XD60Jw"
	});
	var url = "http://api.yelp.com/v2/search?term=" + restaurantName + "&location=" + restaurantLocation;
	oauth.get(url, function(data){
		var obj = JSON.parse(data.text);
		console.log(data.text);
		cb(null, obj);
	}, function(data){
		console.log("Error in getYelpUrl. Data: " + data);
		console.log(data);
		cb(data);
	});
	
};

exports.loadBookmarkedRestaurants = function (pnums, lat, lon, cb){
	//checkNetworkConnectivity();
	if (ENV_DEVELOPMENT){
		cb(null,JSON.stringify(getMockBookmarkedRestaurants()));
		return;
	}
	
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.ApiBaseUri + 'restaurant?latitude=' + lat + '&longitude=' + lon +'&pnums=' + pnums;
	xhr.open('GET', url);	
	xhr.onload = function(){
		console.log(this.responseText);
		cb(null, this.responseText);
	};
	xhr.onerror = function(e){
		console.log('Error in loadBookmarkedRestaurants. ' + e.code + e.error);
		cb(e);
	};
	xhr.send();
};

exports.loadRestaurantsByName = function(name, lat, lon,start,end,cb){
	//checkNetworkConnectivity();
	if (ENV_DEVELOPMENT){
		cb(null,JSON.stringify(getMockRestaurantsByName()));
		return;
	}
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.ApiBaseUri + 'restaurant?latitude=' + lat + 
		'&longitude=' + lon + 
		'&start=' + start +
		'&end=' + end +
		'&name=' + name;
	xhr.open('GET', url);
	xhr.onload = function(){
		console.log(this.responseText);
		cb(null, this.responseText);
	};
	xhr.onerror = function(e){
		console.log('Error in loadRestaurantsByName. ' + e.code + e.error);
		cb(e);
	};
	xhr.send();
};

exports.loadNearbyRestaurants = function(lat,lon,start,end,cb){
	//checkNetworkConnectivity();
	if (ENV_DEVELOPMENT){
		cb(null,JSON.stringify(getMockNearbyRestaurants()));
		return;
	}
	
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.ApiBaseUri + 'restaurant?latitude=' + lat + 
		'&longitude=' + lon +
		'&start=' + start +
		'&end=' + end;
	console.log(url);
	xhr.open('GET', url);	
	xhr.onload = function(){
		console.log(this.responseText);
		cb(null, this.responseText);
	};
	xhr.onerror = function(e){
		console.log('Error in loadNearbyRestaurants. ' + e.code + e.error);
		cb(e);
	};
	xhr.send();
};

exports.loadRestaurantDetails = function (permitNumber, cb){
	//checkNetworkConnectivity();
	if (ENV_DEVELOPMENT){
		cb(null,JSON.stringify(getMockRestaurantDetails()));
		return;
	}
	
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.ApiBaseUri + 'restaurantdetail/' + permitNumber;
	xhr.open('GET', url);
	xhr.onload = function(){
		console.log(this.responseText);
		cb(null, this.responseText);
	};
	xhr.onerror = function(e){
		console.log('Error in loadRestaurantDetails. ' + e.code + e.error);
		cb(e);
	};
	xhr.send();
};

exports.submitFeedback = function(feedback, cb){
	//checkNetworkConnectivity();
	var xhr = Ti.Network.createHTTPClient();
	var url = Alloy.CFG.InternalApiBaseUri + 'RestaurantInspectionsAppFeedback/';
	console.log(url);
	xhr.open('POST', url);
	xhr.setRequestHeader('Authorization', getAuthHeader());
	xhr.setRequestHeader('Content-Type', 'application/json');
	var payload = JSON.stringify(feedback);
	console.log(payload);
	xhr.onload = function(){
		return cb(null);
	};
	xhr.onerror = function(e){
		console.log('Error in submitFeedback. Status Code: ' + this.status + ', ' + e.code + e.error);
		cb(e);
	};
	xhr.send(payload);
};

exports.getGoogleReverseGeo = function (lat, lng, cb){
	//checkNetworkConnectivity();
	var xhr = Ti.Network.createHTTPClient();
	xhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=' + lat + ',' + lng);
	xhr.onload = function(){
		var res = JSON.parse(this.responseText);
		cb(null,res);
	};
	xhr.onerror = function(e){
		cb(e);
	};
	xhr.send();
};

function getMockYelpData(){
	return {"region": {"span": {"latitude_delta": 0.20648319999999387, "longitude_delta": 0.30430652999999097}, "center": {"latitude": 36.115261000000004, "longitude": -115.17906415}}, "total": 77, "businesses": [{"is_claimed": false, "rating": 2.0, "mobile_url": "http://m.yelp.com/biz/kentucky-fried-chicken-las-vegas-3", "rating_img_url": "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/b561c24f8341/ico/stars/v1/stars_2.png", "review_count": 1, "name": "Kentucky Fried Chicken", "snippet_image_url": "http://s3-media2.fl.yelpcdn.com/photo/m0H0JBW0i6pQXUPBH30Yog/ms.jpg", "rating_img_url_small": "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/a6210baec261/ico/stars/v1/stars_small_2.png", "url": "http://www.yelp.com/biz/kentucky-fried-chicken-las-vegas-3", "phone": "7028732737", "snippet_text": "I have three things to say about KFC...1. They have the best F'ing coleslaw ever....2.Its total bs that they charge 25 cents extra for each dipping sauce...", "image_url": "http://s3-media4.fl.yelpcdn.com/bphoto/rS-olkNy5SFBQTPLSfzVOg/ms.jpg", "categories": [["Fast Food", "hotdogs"]], "display_phone": "+1-702-873-2737", "rating_img_url_large": "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/c00926ee5dcb/ico/stars/v1/stars_large_2.png", "id": "kentucky-fried-chicken-las-vegas-3", "is_closed": false, "location": {"city": "Las Vegas", "display_address": ["4855 S Fort Apache Rd", "Spring Valley", "Las Vegas, NV 89147"], "geo_accuracy": 8.0, "neighborhoods": ["Spring Valley"], "postal_code": "89147", "country_code": "US", "address": ["4855 S Fort Apache Rd"], "coordinate": {"latitude": 36.101039886474602, "longitude": -115.297813415527}, "state_code": "NV"}}, {"is_claimed": false, "rating": 3.5, "mobile_url": "http://m.yelp.com/biz/kentucky-fried-chicken-las-vegas-2", "rating_img_url": "http://s3-media1.fl.yelpcdn.com/assets/2/www/img/5ef3eb3cb162/ico/stars/v1/stars_3_half.png", "review_count": 3, "name": "Kentucky Fried Chicken", "snippet_image_url": "http://s3-media4.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cc4afe21892e/assets/img/default_avatars/user_medium_square.png", "rating_img_url_small": "http://s3-media1.fl.yelpcdn.com/assets/2/www/img/2e909d5d3536/ico/stars/v1/stars_small_3_half.png", "url": "http://www.yelp.com/biz/kentucky-fried-chicken-las-vegas-2", "phone": "7024344019", "snippet_text": "Had a great experience at this Kentucky Fried Chicken.  This place always seems to be same no matter what franchise.  Staff was good", "categories": [["Restaurants", "restaurants"]], "display_phone": "+1-702-434-4019", "rating_img_url_large": "http://s3-media3.fl.yelpcdn.com/assets/2/www/img/bd9b7a815d1b/ico/stars/v1/stars_large_3_half.png", "id": "kentucky-fried-chicken-las-vegas-2", "is_closed": false, "location": {"city": "Las Vegas", "display_address": ["2840 E Tropicana Ave", "Eastside", "Las Vegas, NV 89121"], "geo_accuracy": 8.0, "neighborhoods": ["Eastside", "Southeast"], "postal_code": "89121", "country_code": "US", "address": ["2840 E Tropicana Ave"], "coordinate": {"latitude": 36.100326538085902, "longitude": -115.111930847168}, "state_code": "NV"}}, {"is_claimed": false, "rating": 2.0, "mobile_url": "http://m.yelp.com/biz/kentucky-fried-chicken-henderson-2", "rating_img_url": "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/b561c24f8341/ico/stars/v1/stars_2.png", "review_count": 8, "name": "Kentucky Fried Chicken", "snippet_image_url": "http://s3-media1.fl.yelpcdn.com/photo/Z0RutVUz42NPtfWNNV6skg/ms.jpg", "rating_img_url_small": "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/a6210baec261/ico/stars/v1/stars_small_2.png", "url": "http://www.yelp.com/biz/kentucky-fried-chicken-henderson-2", "phone": "7024506354", "snippet_text": "I found that KFC has really changed things.. and I am.. not sure it is for the better . \nThe chicken is VERY salty. TOO salty. \nBut i like their mashed...", "image_url": "http://s3-media2.fl.yelpcdn.com/bphoto/H8jz0aQlZpPHfxw29eEG1w/ms.jpg", "categories": [["Restaurants", "restaurants"]], "display_phone": "+1-702-450-6354", "rating_img_url_large": "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/c00926ee5dcb/ico/stars/v1/stars_large_2.png", "id": "kentucky-fried-chicken-henderson-2", "is_closed": false, "location": {"city": "Henderson", "display_address": ["1282 W Warm Springs Road", "Henderson, NV 89014"], "geo_accuracy": 8.0, "postal_code": "89014", "country_code": "US", "address": ["1282 W Warm Springs Road"], "coordinate": {"latitude": 36.056739999999998, "longitude": -115.040741}, "state_code": "NV"}}, {"is_claimed": false, "rating": 2.5, "mobile_url": "http://m.yelp.com/biz/kentucky-fried-chicken-north-las-vegas", "rating_img_url": "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/c7fb9aff59f9/ico/stars/v1/stars_2_half.png", "review_count": 2, "name": "Kentucky Fried Chicken", "snippet_image_url": "http://s3-media4.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cc4afe21892e/assets/img/default_avatars/user_medium_square.png", "rating_img_url_small": "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/8e8633e5f8f0/ico/stars/v1/stars_small_2_half.png", "url": "http://www.yelp.com/biz/kentucky-fried-chicken-north-las-vegas", "menu_date_updated": 1387484067, "phone": "7026337895", "snippet_text": "Great service, the food was hot and didn't have to wait for anything, best KFC I have been to in a while.", "image_url": "http://s3-media1.fl.yelpcdn.com/bphoto/HBI-vteTjvO8J3hISgOxzA/ms.jpg", "categories": [["Restaurants", "restaurants"]], "display_phone": "+1-702-633-7895", "rating_img_url_large": "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/d63e3add9901/ico/stars/v1/stars_large_2_half.png", "menu_provider": "single_platform", "id": "kentucky-fried-chicken-north-las-vegas", "is_closed": false, "location": {"city": "North Las Vegas", "display_address": ["2711 Las Vegas Blvd N", "North Las Vegas, NV 89030"], "geo_accuracy": 8.0, "postal_code": "89030", "country_code": "US", "address": ["2711 Las Vegas Blvd N"], "coordinate": {"latitude": 36.209117999999997, "longitude": -115.108925}, "state_code": "NV"}}]};
}

function getMockBookmarkedRestaurants(){
	return [{"dist":3.835965889909316,"permit_number":"PR0000532","facility_id":"FA0002435","PE":1016,"restaurant_name":"CAESARS PIZZA LOUNGE BAR","location_name":"CAESARS PALACE HOTEL & CASINO","address":"3570 S Las Vegas Blvd","latitude":36.1157783,"longitude":-115.1729633,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8924","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":3,"date_current":"2011-10-05T07:00:00.000Z","previous_grade":"A","date_previous":"2011-10-05T07:00:00.000Z"},{"dist":3.835965889909316,"permit_number":"PR0000533","facility_id":"FA0002435","PE":1006,"restaurant_name":"CAESARS CYPRESS ST PIZZA STATION","location_name":"CAESARS PALACE HOTEL & CASINO","address":"3570 S Las Vegas Blvd","latitude":36.1157783,"longitude":-115.1729633,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8924","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":10,"date_current":"2011-09-13T07:00:00.000Z","previous_grade":"A","date_previous":"2011-09-13T07:00:00.000Z"}];
}

function getMockRestaurantsByName(){
	return [{"dist":3.835965889909316,"permit_number":"PR0000532","facility_id":"FA0002435","PE":1016,"restaurant_name":"CAESARS PIZZA LOUNGE BAR","location_name":"CAESARS PALACE HOTEL & CASINO","address":"3570 S Las Vegas Blvd","latitude":36.1157783,"longitude":-115.1729633,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8924","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":3,"date_current":"2011-10-05T07:00:00.000Z","previous_grade":"A","date_previous":"2011-10-05T07:00:00.000Z"},{"dist":3.835965889909316,"permit_number":"PR0000533","facility_id":"FA0002435","PE":1006,"restaurant_name":"CAESARS CYPRESS ST PIZZA STATION","location_name":"CAESARS PALACE HOTEL & CASINO","address":"3570 S Las Vegas Blvd","latitude":36.1157783,"longitude":-115.1729633,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8924","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":10,"date_current":"2011-09-13T07:00:00.000Z","previous_grade":"A","date_previous":"2011-09-13T07:00:00.000Z"},{"dist":3.5306830148882042,"permit_number":"PR0000651","facility_id":"FA0002452","PE":1003,"restaurant_name":"California Pizza Kitchen","location_name":"MIRAGE HOTEL & CASINO","address":"3400 S Las Vegas Blvd","latitude":36.1205825,"longitude":-115.1724115,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8923","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":10,"date_current":"2012-05-15T07:00:00.000Z","previous_grade":"C","date_previous":"2012-05-11T07:00:00.000Z"},{"dist":3.5306830148882042,"permit_number":"PR0000694","facility_id":"FA0002452","PE":1016,"restaurant_name":"California Pizza Kit Service Bar","location_name":"MIRAGE HOTEL & CASINO","address":"3400 S Las Vegas Blvd","latitude":36.1205825,"longitude":-115.1724115,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8923","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":7,"date_current":"2011-10-24T07:00:00.000Z","previous_grade":"A","date_previous":"2010-10-25T07:00:00.000Z"},{"dist":3.5306830148882042,"permit_number":"PR0000695","facility_id":"FA0002452","PE":1043,"restaurant_name":"California Pizza Kit Prep","location_name":"MIRAGE HOTEL & CASINO","address":"3400 S Las Vegas Blvd","latitude":36.1205825,"longitude":-115.1724115,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8923","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":7,"date_current":"2011-10-24T07:00:00.000Z","previous_grade":"A","date_previous":"2010-10-25T07:00:00.000Z"},{"dist":3.5306830148882042,"permit_number":"PR0000716","facility_id":"FA0002452","PE":1012,"restaurant_name":"Mirage Buffet Pizza Prep / Display","location_name":"MIRAGE HOTEL & CASINO","address":"3400 S Las Vegas Blvd","latitude":36.1205825,"longitude":-115.1724115,"city_id":10,"city_name":"Las Vegas","zip_code":"89109-8923","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":9,"date_current":"2012-02-28T08:00:00.000Z","previous_grade":"A","date_previous":"2011-06-13T07:00:00.000Z"}];
}

function getMockRestaurantDetails(){
	return {"address":"5587 S Rainbow Blvd","permitId": "PR0001062","latitude":36.0877539,"longitude":-115.243508,"name":"Kentucky Fried Chicken / Pizza Hut","zipCode":"89118-1857","inspections":[{"grade":"A","inspectionDemerits":5,"employeeId":"EE7000594","violations":["Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","In-use utensils improperly handled and/or stored."],"inspectionTime":"2005-08-26T20:10:00.000Z"},{"grade":"A","inspectionDemerits":8,"employeeId":"EE7000594","violations":["Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","Food unprotected from cross-contamination by food handlers."],"inspectionTime":"2005-08-03T19:50:00.000Z"},{"grade":"A","inspectionDemerits":6,"employeeId":"EE7000594","violations":["Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","Foods not stored off the floor.","Unclean wiping cloths, stored in an unapproved sanitizer, and/or unrestricted in use."],"inspectionTime":"2005-02-08T23:10:00.000Z"},{"grade":"A","inspectionDemerits":6,"employeeId":"EE7000374","violations":["Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","Health cards not current on all food handlers.","Unapproved food contact surfaces. Food contact surfaces not  smooth, easily cleanable, properly constructed and/or installed."],"inspectionTime":"2004-09-13T20:30:00.000Z"},{"grade":"A","inspectionDemerits":9,"employeeId":"EE7000398","violations":["Inadequate hot and cold holding equipment; improperly designed, maintained and/or operated.","Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","Improper lighting and/or ventilation, ventilation hoods and/or filters improperly cleaned and/or maintained."],"inspectionTime":"2004-06-14T20:15:00.000Z"},{"grade":"A","inspectionDemerits":7,"employeeId":"EE7000398","violations":["Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","Non-food contact surfaces improperly constructed and/or installed.","Non-food contact surfaces and/or cooking devices not maintained and/or unclean.","Improper lighting and/or ventilation, ventilation hoods and/or filters improperly cleaned and/or maintained."],"inspectionTime":"2003-10-14T19:40:00.000Z"},{"grade":"A","inspectionDemerits":7,"employeeId":"EE7000390","violations":["Kitchenware and/or food contact surfaces of equipment improperly cleaned, sanitized and/or air dried.","Non-food contact surfaces and/or cooking devices not maintained and/or unclean.","Improper lighting and/or ventilation, ventilation hoods and/or filters improperly cleaned and/or maintained.","Floors, walls, ceilings, improperly constructed and/or installed.  Not in good repair and/or clean."],"inspectionTime":"2003-07-10T03:30:00.000Z"},{"grade":"A","inspectionDemerits":8,"employeeId":"EE7000417","violations":["Health cards not current on all food handlers.","Unclean wiping cloths, stored in an unapproved sanitizer, and/or unrestricted in use.","Non-food contact surfaces and/or cooking devices not maintained and/or unclean.","Improper lighting and/or ventilation, ventilation hoods and/or filters improperly cleaned and/or maintained.","Food unprotected by cross-contamination by proper storage."],"inspectionTime":"2003-01-14T19:05:00.000Z"},{"grade":"A","inspectionDemerits":2,"employeeId":"EE7000417","violations":["Non-food contact surfaces and/or cooking devices not maintained and/or unclean.","Improper lighting and/or ventilation, ventilation hoods and/or filters improperly cleaned and/or maintained."],"inspectionTime":"2002-06-28T18:25:00.000Z"},{"grade":"A","inspectionDemerits":5,"employeeId":"EE7000374","violations":["Unclean wiping cloths, stored in an unapproved sanitizer, and/or unrestricted in use.","Food unprotected from cross-contamination by chemicals."],"inspectionTime":"2002-01-25T22:10:00.000Z"},{"grade":"A","inspectionDemerits":1,"employeeId":"EE0000001","violations":["Unclean wiping cloths, stored in an unapproved sanitizer, and/or unrestricted in use."],"inspectionTime":"2001-06-09T02:45:00.000Z"},{"grade":"A","inspectionDemerits":4,"employeeId":"EE7000321","violations":["Unsuitable hand washing facilities, unclean, inaccessible and/or not in good repair, with unapproved soap, towels and/or waste receptacles not provided.","Foods not stored off the floor."],"inspectionTime":"2001-05-21T22:00:00.000Z"},{"grade":"A","inspectionDemerits":1,"employeeId":"EE7000373","violations":["Accurate thermometers, chemical tests kits, and/or pressure gauges not present and/or working."],"inspectionTime":"2000-12-18T20:20:00.000Z"},{"grade":"A","inspectionDemerits":null,"employeeId":"EE0000001","violations":[],"inspectionTime":"2000-10-25T22:45:00.000Z"},{"grade":"A","inspectionDemerits":5,"employeeId":"EE7000373","violations":["Inadequate hot and cold holding equipment; improperly designed, maintained and/or operated.","Non-food contact surfaces improperly constructed and/or installed."],"inspectionTime":"2000-10-25T22:00:00.000Z"}]};
}

function getMockNearbyRestaurants(){
	return [{"dist":265.9087886470126,"permit_number":"PR0096986","facility_id":"FA0066314","PE":1094,"restaurant_name":"Murray Family Farms Farmer's Market Low Risk","location_name":"Murray Family Farms Farmer's Market Low Risk","address":"6700 General Beale Rd","latitude":35.2920746,"longitude":-118.7526866,"city_id":-1,"city_name":"Bakersfield","zip_code":"96603","nciaa":null,"plan_review":null,"record_status":"01","current_grade":null,"current_demerits":null,"date_current":null,"previous_grade":null,"date_previous":null},{"dist":361.13528353492876,"permit_number":"PR0022987","facility_id":"FA0009922","PE":1096,"restaurant_name":"China Ranch Dates FMLR","location_name":"China Ranch Dates Inc","address":null,"latitude":35.9730179,"longitude":-116.2711387,"city_id":-1,"city_name":"Shoshone","zip_code":"92384","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"P","current_demerits":3,"date_current":"2012-02-23T08:00:00.000Z","previous_grade":"P","date_previous":"2012-02-23T08:00:00.000Z"},{"dist":365.9043974960227,"permit_number":"PR0096663","facility_id":"FA0066110","PE":1096,"restaurant_name":"Claim Jumper's Gifts - Farmer Market Low Risk","location_name":"Claim Jumper's Gifts","address":"2220 N Leslie St","latitude":36.25223,"longitude":-116.05138,"city_id":-1,"city_name":"Pahrump","zip_code":"89060","nciaa":null,"plan_review":null,"record_status":"01","current_grade":"P","current_demerits":0,"date_current":"2012-01-06T08:00:00.000Z","previous_grade":null,"date_previous":null},{"dist":369.3906974796193,"permit_number":"PR0098494","facility_id":"FA0067185","PE":1083,"restaurant_name":"Where's the Fire - Mobile","location_name":"Where's the Fire - Mobile","address":"21041 Bear Valley","latitude":34.470918,"longitude":-117.204886,"city_id":-1,"city_name":"Apple Valley","zip_code":"92308","nciaa":null,"plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-04-28T07:00:00.000Z","previous_grade":null,"date_previous":null},{"dist":379.52592092124326,"permit_number":"PR0001511","facility_id":"FA0003359","PE":1104,"restaurant_name":"Indian Springs Jr / Sr High Kitchen","location_name":"Indian Springs Jr/Sr Hi School","address":"400 Sky Rd","latitude":36.5733926,"longitude":-115.675545,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":4,"date_current":"2012-03-21T07:00:00.000Z","previous_grade":"A","date_previous":"2011-09-29T07:00:00.000Z"},{"dist":379.6909343321418,"permit_number":"PR0015103","facility_id":"FA0008304","PE":1016,"restaurant_name":"Thebar at Indian Springs","location_name":"Bar at Indian Springs, The","address":"283 Clark Ln","latitude":36.574642,"longitude":-115.672058,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":10,"date_current":"2012-05-08T07:00:00.000Z","previous_grade":"A","date_previous":"2011-11-03T07:00:00.000Z"},{"dist":379.6909343321418,"permit_number":"PR0015104","facility_id":"FA0008304","PE":1006,"restaurant_name":"Thebar at Indian Springs - Kitchen","location_name":"Bar at Indian Springs, The","address":"283 Clark Ln","latitude":36.574642,"longitude":-115.672058,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":4,"date_current":"2012-05-08T07:00:00.000Z","previous_grade":"A","date_previous":"2011-11-03T07:00:00.000Z"},{"dist":379.8304239547051,"permit_number":"PR0021297","facility_id":"FA0009450","PE":1086,"restaurant_name":"Luke's All American Ice Cream","location_name":"Luke's All American Ice Cream","address":"236 Macfarland Ave 60","latitude":36.5717396,"longitude":-115.6704085,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"02","current_grade":"A","current_demerits":0,"date_current":"2010-06-29T07:00:00.000Z","previous_grade":"A","date_previous":"2009-06-10T07:00:00.000Z"},{"dist":379.8576904270375,"permit_number":"PR0020553","facility_id":"FA0063274","PE":1006,"restaurant_name":"Indian Springs Casino Coffee Shop","location_name":"INDIAN SPRINGS CASINO","address":"372 Tonopah Hwy","latitude":36.5696826,"longitude":-115.6705757,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":8,"date_current":"2012-03-23T07:00:00.000Z","previous_grade":"A","date_previous":"2012-03-23T07:00:00.000Z"},{"dist":379.8576904270375,"permit_number":"PR0020554","facility_id":"FA0063274","PE":1016,"restaurant_name":"Indian Springs Casino Lounge","location_name":"INDIAN SPRINGS CASINO","address":"372 Tonopah Hwy","latitude":36.5696826,"longitude":-115.6705757,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":1,"date_current":"2012-03-23T07:00:00.000Z","previous_grade":"A","date_previous":"2012-03-23T07:00:00.000Z"},{"dist":379.8576904270375,"permit_number":"PR0012608","facility_id":"FA0006997","PE":1016,"restaurant_name":"Indian Springs Deli","location_name":"Indian Springs General Store","address":"300 Tonopah Hwy","latitude":36.5696826,"longitude":-115.6705757,"city_id":8,"city_name":"Indian Springs","zip_code":"89018","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":5,"date_current":"2012-05-08T07:00:00.000Z","previous_grade":"A","date_previous":"2011-11-02T07:00:00.000Z"},{"dist":387.4004724313266,"permit_number":"PR0001527","facility_id":"FA0003363","PE":1103,"restaurant_name":"Lundy, Earl B. Elem School Kitchen","location_name":"Lundy, Earl B Elementary School","address":"HWY 57 Hcr 38 Box 275","latitude":36.2571855,"longitude":-115.6427949,"city_id":-1,"city_name":"Mt CHARLESTON","zip_code":"89124","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-05-01T07:00:00.000Z","previous_grade":"A","date_previous":"2011-11-18T08:00:00.000Z"},{"dist":389.7280228230519,"permit_number":"PR0019882","facility_id":"FA0063873","PE":1006,"restaurant_name":"Mt Charleston Resort Restaurant","location_name":"Mt Charleston Resort","address":"2 Kyle Canyon Rd","latitude":36.269983,"longitude":-115.593834,"city_id":10,"city_name":"Las Vegas","zip_code":"89124-9283","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":2,"date_current":"2012-05-04T07:00:00.000Z","previous_grade":"B","date_previous":"2012-05-01T07:00:00.000Z"},{"dist":389.7280228230519,"permit_number":"PR0019883","facility_id":"FA0063873","PE":1016,"restaurant_name":"Mt Charleston Resort Lounge","location_name":"Mt Charleston Resort","address":"2 Kyle Canyon Rd","latitude":36.269983,"longitude":-115.593834,"city_id":10,"city_name":"Las Vegas","zip_code":"89124-9283","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":7,"date_current":"2012-05-01T07:00:00.000Z","previous_grade":"O","date_previous":"2011-06-28T07:00:00.000Z"},{"dist":389.7280228230519,"permit_number":"PR0019884","facility_id":"FA0063873","PE":1016,"restaurant_name":"Mt Charleston Resort Lounge II","location_name":"Mt Charleston Resort","address":"2 Kyle Canyon Rd","latitude":36.269983,"longitude":-115.593834,"city_id":10,"city_name":"Las Vegas","zip_code":"89124-9283","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":4,"date_current":"2012-05-01T07:00:00.000Z","previous_grade":"A","date_previous":"2011-02-04T08:00:00.000Z"},{"dist":389.7280228230519,"permit_number":"PR0019885","facility_id":"FA0063873","PE":1009,"restaurant_name":"Mt Charleston Resort Snack Bar","location_name":"Mt Charleston Resort","address":"2 Kyle Canyon Rd","latitude":36.269983,"longitude":-115.593834,"city_id":10,"city_name":"Las Vegas","zip_code":"89124-9283","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":4,"date_current":"2012-05-01T07:00:00.000Z","previous_grade":"A","date_previous":"2011-11-18T08:00:00.000Z"},{"dist":398.97857673440143,"permit_number":"PR0023649","facility_id":"FA0011241","PE":1006,"restaurant_name":"Carter's Cafe","location_name":"Carter's Cafe","address":"777 E Quartz Ave","latitude":35.809074,"longitude":-115.623168,"city_id":19,"city_name":"Sandy Valley","zip_code":"89019-8501","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"O","current_demerits":2,"date_current":"2011-05-02T07:00:00.000Z","previous_grade":"O","date_previous":"2011-05-02T07:00:00.000Z"},{"dist":399.45315935241905,"permit_number":"PR0002313","facility_id":"FA0003535","PE":1104,"restaurant_name":"Sandy Valley School Kitchen","location_name":"Sandy Valley School","address":"1480 E Pearl St","latitude":35.8127784,"longitude":-115.6121843,"city_id":19,"city_name":"Sandy Valley","zip_code":"89019","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-05-01T07:00:00.000Z","previous_grade":"A","date_previous":"2011-10-13T07:00:00.000Z"},{"dist":400.84033433379085,"permit_number":"PR0001554","facility_id":"FA0003375","PE":1103,"restaurant_name":"Scherkenbach, Wil / Mary Elem Kitchen","location_name":"Scherkenbach, Wil/Mary Elem School","address":"9371 Iron Mountain Rd","latitude":36.3213393,"longitude":-115.3651747,"city_id":10,"city_name":"Las Vegas","zip_code":"89143-5802","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-03-06T08:00:00.000Z","previous_grade":"A","date_previous":"2011-09-30T07:00:00.000Z"},{"dist":401.24655824827346,"permit_number":"PR0001179","facility_id":"FA0002556","PE":1016,"restaurant_name":"Idle Spurs Lounge","location_name":"Idle Spurs Lounge and Restaurant","address":"1650 Quartz Ave","latitude":35.8094759,"longitude":-115.579297,"city_id":19,"city_name":"Sandy Valley","zip_code":"89019","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":3,"date_current":"2011-03-31T07:00:00.000Z","previous_grade":"A","date_previous":"2011-03-31T07:00:00.000Z"},{"dist":401.24655824827346,"permit_number":"PR0015225","facility_id":"FA0007571","PE":1009,"restaurant_name":"Trails End General - Snack Bar","location_name":"Trails End General Store","address":"600 E Quartz Ave","latitude":35.8094759,"longitude":-115.579297,"city_id":19,"city_name":"Sandy Valley","zip_code":"89019","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":7,"date_current":"2011-03-31T07:00:00.000Z","previous_grade":"A","date_previous":"2011-03-31T07:00:00.000Z"},{"dist":401.7354423624135,"permit_number":"PR0009845","facility_id":"FA0005881","PE":1115,"restaurant_name":"Potosi Pine Camp Kitchen","location_name":"Potosi Pine Camp","address":"19028 Mt Potosi Rd","latitude":36.0003381,"longitude":-115.479902,"city_id":10,"city_name":"Las Vegas","zip_code":"89124","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-05-22T07:00:00.000Z","previous_grade":"A","date_previous":"2011-08-12T07:00:00.000Z"},{"dist":401.7354423624135,"permit_number":"PR0002710","facility_id":"FA0002347","PE":1115,"restaurant_name":"Las Vegas Area Council Camp Kitchen","location_name":"Kimball Scout Reservation","address":"10877 Mt Potosi Rd","latitude":36.0003381,"longitude":-115.479902,"city_id":10,"city_name":"Las Vegas","zip_code":"89161","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"a","current_demerits":1,"date_current":"2012-06-05T07:00:00.000Z","previous_grade":"A","date_previous":"2011-06-16T07:00:00.000Z"},{"dist":403.5666092807043,"permit_number":"PR0021251","facility_id":"FA0010491","PE":1003,"restaurant_name":"Mt Charleston Lodge Restaurant","location_name":"Mt Charleston Lodge","address":"5375 Kyle Canyon Rd","latitude":36.32796,"longitude":-115.311569,"city_id":10,"city_name":"Las Vegas","zip_code":"89124-9234","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":1,"date_current":"2012-06-08T07:00:00.000Z","previous_grade":"B","date_previous":"2012-05-24T07:00:00.000Z"},{"dist":403.5666092807043,"permit_number":"PR0021252","facility_id":"FA0010491","PE":1016,"restaurant_name":"Mt Charleston Lodge Lounge","location_name":"Mt Charleston Lodge","address":"5375 Kyle Canyon Rd","latitude":36.32796,"longitude":-115.311569,"city_id":10,"city_name":"Las Vegas","zip_code":"89124-9234","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":5,"date_current":"2012-05-24T07:00:00.000Z","previous_grade":"A","date_previous":"2011-11-21T08:00:00.000Z"},{"dist":403.6720276015356,"permit_number":"PR0001530","facility_id":"FA0003365","PE":1103,"restaurant_name":"Bozarth, Henry & Evelyn Kitchen","location_name":"Bozarth, Henry & Evelyn Elementary","address":"7431 Egan Crest Dr","latitude":36.296563,"longitude":-115.321292,"city_id":10,"city_name":"Las Vegas","zip_code":"89166-1600","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-03-06T08:00:00.000Z","previous_grade":"A","date_previous":"2012-01-04T08:00:00.000Z"},{"dist":404.02193071424597,"permit_number":"PR0020542","facility_id":"FA0063263","PE":1006,"restaurant_name":"Subway #45393","location_name":"My2Boys, LLC","address":"7171 N Hualapai","latitude":36.2958002,"longitude":-115.3150085,"city_id":10,"city_name":"Las Vegas","zip_code":"89166","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-04-20T07:00:00.000Z","previous_grade":"A","date_previous":"2011-10-18T07:00:00.000Z"},{"dist":404.1012501976494,"permit_number":"PR0001567","facility_id":"FA0003381","PE":1105,"restaurant_name":"Horizon - Peterson High School Kitchen","location_name":"Horizon-Peterson High School","address":"10250 Centennial Pkwy","latitude":36.278218,"longitude":-115.320168,"city_id":10,"city_name":"Las Vegas","zip_code":"89149-1257","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-04-10T07:00:00.000Z","previous_grade":"A","date_previous":"2011-12-13T08:00:00.000Z"},{"dist":404.1805169295231,"permit_number":"PR0001564","facility_id":"FA0003380","PE":1105,"restaurant_name":"Centennial High School Kitchen","location_name":"Centennial High School","address":"10200 Centennial Pkwy","latitude":36.277504,"longitude":-115.31895,"city_id":10,"city_name":"Las Vegas","zip_code":"89149-1257","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":7,"date_current":"2012-03-01T08:00:00.000Z","previous_grade":"A","date_previous":"2011-12-13T08:00:00.000Z"},{"dist":404.1805169295231,"permit_number":"PR0001565","facility_id":"FA0003380","PE":1009,"restaurant_name":"Centennial High School - Snack Bar","location_name":"Centennial High School","address":"10200 Centennial Pkwy","latitude":36.277504,"longitude":-115.31895,"city_id":10,"city_name":"Las Vegas","zip_code":"89149-1257","nciaa":"Y","plan_review":null,"record_status":"01","current_grade":"A","current_demerits":0,"date_current":"2012-03-01T08:00:00.000Z","previous_grade":"A","date_previous":"2011-03-31T07:00:00.000Z"}];
}

