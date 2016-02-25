var app = app || {};

app.AccountsView = Backbone.View.extend({
    el: $('#accounts'),


    initialize: function( initialAccounts ) {      
        this.collection = new app.Accounts();   

        this.collection.fetch({reset:true});
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
            console.log($(el).val());
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
        
        this.$("#accountTable").append( accountView.render().el);
        $(".table-name").editable(getEditableParams("name", accountView));
        $(".table-username").editable(getEditableParams("username", accountView));
        $(".table-password").editable(getEditableParams("password", accountView));
        $(".table-comment").editable(getEditableParams("comment", accountView));
    }
});

function getEditableParams(fieldName, view) {
    return {
            type        : 'text',
            name        : fieldName,
            pk          : view.model.get("id"),
            url         : '',
            success     : function(response, newValue) {     
                view.model.set(fieldName, newValue);
                view.model.save(fieldName, newValue);
            }
    }
}