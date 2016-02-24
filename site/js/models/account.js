var app = app || {};

app.Account = Backbone.Model.extend({
    defaults: {
        name: 'Example',
        username: 'example@example.com',
        password: 'password123'
    }
});