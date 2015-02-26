exports.createActivityMenuWithRefreshAndSearch = function(activity, cb){
	if (typeof activity.invalidateOptionsMenu == "function"){
		activity.invalidateOptionsMenu();
	}
	activity.onCreateOptionsMenu = function(e) {
		var menuItem = e.menu.add({
			itemId : 0,
			title : "Refresh",
            icon: "/images/refresh.png",
            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		});
		menuItem.addEventListener("click", function(e) {
			cb({viewName: "Nearby", title: "Nearby Restaurants"});
        });
        menuItem = e.menu.add({
			itemId : 1,
			title : "Search",
			icon: Ti.Android.R.drawable.ic_menu_search,
            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		});
		menuItem.addEventListener("click", function(e) {
			Ti.App.fireEvent("searchClicked");
        });
		// menuItem = e.menu.add({
			// itemId : 2,
			// title : "Nearby Restaurants",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
            // cb({viewName: "Nearby", title: "Nearby Restaurants"});
        // });
        // menuItem = e.menu.add({
			// itemId : 3,
			// title : "Bookmarked Restaurants",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "Bookmarked", title: "Bookmarked Restaurants"});
        // });
        // menuItem = e.menu.add({
			// itemId : 4,
			// title : "Show Legend",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "Legend", title: "Show Legend"});
        // });
        // menuItem = e.menu.add({
			// itemId : 5,
			// title : "About",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "About", title: "About"});
        // });
        // menuItem = e.menu.add({
			// itemId : 6,
			// title : "Tweet",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "tweet", title: "Tweet"});
        // });
	};
};

exports.createActivityMenu = function(activity, cb){
	if (typeof activity.invalidateOptionsMenu == "function"){
		activity.invalidateOptionsMenu();
	}
	activity.onCreateOptionsMenu = function(e) {
		// menuItem = e.menu.add({
			// itemId : 0,
			// title : "Nearby Restaurants",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
            // cb({viewName: "Nearby", title: "Nearby Restaurants"});
        // });
        // menuItem = e.menu.add({
			// itemId : 1,
			// title : "Bookmarked Restaurants",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "Bookmarked", title: "Bookmarked Restaurants"});
        // });
        // menuItem = e.menu.add({
			// itemId : 2,
			// title : "Show Legend",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "Legend", title: "Show Legend"});
        // });
        // menuItem = e.menu.add({
			// itemId : 3,
			// title : "About",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "About", title: "About"});
        // });
        // menuItem = e.menu.add({
			// itemId : 4,
			// title : "Tweet",
			// icon: "/images/feedback.png",
            // showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		// });
		// menuItem.addEventListener("click", function(e) {
			// cb({viewName: "tweet", title: "Tweet"});
        // });
	};
};
