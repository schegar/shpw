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
    	//Delete model
        this.model.destroy();

        //Delete view
        this.remove();
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        //console.log(this.$el);
        //console.log(this.model.attributes);
        //console.log(this.$el.html( this.template( this.model.attributes )));
        this.$el.html( this.template( this.model.attributes ) );


        return this;
    }
});