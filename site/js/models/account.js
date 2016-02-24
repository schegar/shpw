var app = app || {};

app.Account = Backbone.Model.extend({
    defaults: {
        name: 'Example',
        username: 'example@example.com',
        password: 'password123'
    },

    parse: function (response) {
    	response.id = response._id;
    	console.log(response.id);
    	return response;
    }
});