// site/js/views/book.js

var app = app || {};

app.AccountView = Backbone.View.extend({
	tagName: 'tr',

    initialize: function () {
    	this.template = _.template($("#accountTemplate").html());        
    },

    events:  {
    	"click .delete": "deleteAccount"
    },

    deleteAccount: function () {
        this.model.destroy();
        this.remove();
    },

    render: function() {        
        this.$el.html(this.template(this.model.attributes));  
        return this;
    }
});