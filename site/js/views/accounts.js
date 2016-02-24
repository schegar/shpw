var app = app || {};

app.AccountsView = Backbone.View.extend({
    el: $('#accounts'),


    initialize: function( initialAccounts ) {      
        this.collection = new app.Accounts();

        $.ajaxSetup({
            headers: {"Auth": Cookies.get("Auth")}
        });        

        this.collection.fetch({
            reset:true
        });
        this.render();

        this.listenTo(this.collection, "add", this.renderAccount);
        this.listenTo(this.collection, "reset", this.render);
    },

    events:{
        'click #add':'addAccount'
    },

    addAccount: function (e) {
        e.preventDefault();
        var formData = {};

        $("#addAccount div").children("input").each(function (i, el) {
            if ($(el).val() != "") {
                formData[el.id] = $(el).val();
            }
        });

        this.collection.create(formData);
    },

    render: function() {
        this.collection.each(function( item ) {
            this.renderAccount(item);
        }, this );
    },

    renderAccount: function( item ) {
        var accountView = new app.AccountView({
            model: item
        });
        this.$("#accountTable").append( accountView.render().el );
    }
});