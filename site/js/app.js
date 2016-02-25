var app = app || {};

$(function() {

    $.ajaxSetup({
            headers: {"Auth": Cookies.get("Auth")}
    });    
    
    new app.AccountsView();
});