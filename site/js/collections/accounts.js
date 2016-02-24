var app = app || {};

app.Accounts = Backbone.Collection.extend({
    model: app.Account,
    url: "/accounts"
});