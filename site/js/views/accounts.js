var app = app || {};

app.AccountsView = Backbone.View.extend({
    el: $('#accounts'),


    initialize: function( initialAccounts ) {      
        //this.collection = new app.Accounts( initialAccounts );
        //console.log(Cookies.get("Auth"));
        this.collection = new app.Accounts();

        $.ajaxSetup({
            headers: {"Auth": Cookies.get("Auth")}
        });        

        this.collection.fetch({
            //beforeSend: setHeader,
            reset:true
        });
        //console.log(this.collection);
        //this.render();

        this.listenTo(this.collection, "add", this.renderAccount);
        this.listenTo(this.collection, "reset", this.render);
    },

    events:{
        'click #add':'addAccount'
    },

    addAccount: function (e) {
        e.preventDefault();
        console.log("added");
        var formData = {};

        $("#addAccount div").children("input").each(function (i, el) {
            if ($(el).val() != "") {
                formData[el.id] = $(el).val();
            }
        });

        this.collection.create(formData);
    },

    // render library by rendering each book in its collection
    render: function() {
        this.collection.each(function( item ) {
            this.renderAccount(item);
        }, this );
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderAccount: function( item ) {
        var accountView = new app.AccountView({
            model: item
        });
        this.$("#accountTable").append( accountView.render().el );
    }
});

var setHeader = function (xhr) {
    xhr.setRequestHeader("Auth", Cookies.get("Auth"));
}