var args = arguments[0] || {};

$.wvMain.setUrl(args.url);
$.winWebView.title = args.title;

function btnClose_onClick(){
	$.winWebView.close();	
}

