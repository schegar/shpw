var app = app || {};

app.Account = Backbone.Model.extend({
    defaults: {
    	id: undefined,
        name: 'ExampleAccount',
        username: 'example@example.com',
        password: 'password123',
        comment: ""
    }
});