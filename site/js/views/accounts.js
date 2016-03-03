var app = app || {};

var table;

app.AccountsView = Backbone.View.extend({
    el: $('#accounts'),


    initialize: function( initialAccounts ) {   
        this.collection = new app.Accounts();  

        this.collection.fetch({reset:true});

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
                formData[el.id] = escapeHtml($(el).val());
            }
        });

        this.collection.create(formData);

        reloadTable(this.collection);
        
    },

    render: function() {
        this.collection.each(function( item ) {
            this.renderAccount(item);
        }, this );  

        table = $('#accountTable').dataTable();  

        //makeCopyable();
    },

    renderAccount: function( item ) {
        var accountView = new app.AccountView({
            model: item
        });
        
        this.$("#accountTable").append( accountView.render().el);
    }
});


