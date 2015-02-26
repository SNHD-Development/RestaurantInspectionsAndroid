var serviceAgent = require('serviceAgent');
var util = require('util');
var util_index = require('util.index');

var centerView = Ti.UI.createView();
$.drawer.setLeftView(Alloy.createController('LeftMenu').getView());
$.drawer.setCenterView(centerView);
$.winHome.open();

$.winHome.addEventListener('open',function(){
    var activity=$.winHome.getActivity();
    if (activity){
        var actionBar=activity.getActionBar();
        if (actionBar){
            actionBar.displayHomeAsUp=true;
            actionBar.onHomeIconItemSelected=function(){
              $.drawer.toggleLeftWindow();  
            };
        }    
    }
});

function tweet(){
	var twitterAppUrl = "twitter://post?message=@foodapp Nice App :)";
	var twitterWebUrl = "https://twitter.com/intent/tweet?status=@foodapp Nice App :)";
	Titanium.Platform.openURL(twitterWebUrl);
}

$.winHome.addEventListener('close', function() {
    $.destroy();
});

function menuItemClicked(e){
	if ($.drawer.getIsLeftDrawerVisible()){
		$.drawer.toggleLeftWindow();	
	}
	loadView(e.title, e.viewName);
}

function loadView(title, viewName){
	if (viewName == "tweet"){
		tweet();
		return;
	}
	$.winHome.title=title;
	if (viewName == "Nearby"){
		util_index.createActivityMenuWithRefreshAndSearch($.winHome.activity, menuItemClicked);
	}else{
		util_index.createActivityMenu($.winHome.activity, menuItemClicked);
	}
	
	var outgoingView = centerView.children[0];
	if (outgoingView != null){
		outgoingView.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,opacity:0,duration:300}, function(){
		centerView.removeAllChildren();
		var incomingView = Alloy.createController(viewName,{}).getView();
		incomingView.opacity = 0;
		centerView.add(incomingView);	
		incomingView.animate({curve:Ti.UI.ANIMATION_CURVE_EASE_IN,opacity:1,duration:300});
		
	});	
	}else{
		var incomingView = Alloy.createController(viewName,{}).getView();
		centerView.add(incomingView);
	}
}

function toggleSearchBar(){
	Ti.App.fireEvent("searchClicked");
}

function init(){
	Ti.App.addEventListener('menuItemClicked', menuItemClicked);
	Ti.App.addEventListener('seeDisclaimer', function(){
		menuItemClicked({viewName: "About", title: "About"});
	});
	loadView("Nearby Restaurants","Nearby");
	Ti.App.Properties.setBool("NetworkConnectivityWarningDisplayed", false);
	Ti.Network.addEventListener('change', function(e){
		if (e.networkType == Ti.Network.NETWORK_NONE &&
			Ti.App.Properties.getBool("NetworkConnectivityWarningDisplayed" == false)){
			Ti.App.Properties.setBool("NetworkConnectivityWarningDisplayed", true);
			alert('No network connection is available. App may not function correctly.');
			
		}else{
			Ti.App.Properties.setBool("NetworkConnectivityWarningDisplayed", false);
		}
	});
}

init();
