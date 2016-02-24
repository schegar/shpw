var app = app || {};

app.Account = Backbone.Model.extend({
    defaults: {
        name: 'ExampleAccount',
        username: 'example@example.com',
        password: 'password123'
    }
});