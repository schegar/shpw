// site/js/views/book.js

var app = app || {};

var edit = false;

app.AccountView = Backbone.View.extend({
	tagName: 'tr',

    initialize: function () {
    	this.template = _.template($("#accountTemplate").html());        
    },

    events:  {
    	"click .delete": "deleteAccount",
        "click .edit": "editAccount"
    },

    deleteAccount: function () {

        var collection = this.model.collection;

        this.model.destroy();
        this.remove();

        reloadTable(collection);

    },

    editAccount: function () {

        var modelId = this.model.get("id");
        var row;

        table = $('#accountTable').DataTable();
        var tableData = table.rows().data();

        for (var i = 0; i < tableData.length; i++) {
            if (modelId.toString() === tableData[i][0]) {
                row = ++i;
            }
        }

        var attributes = ["id", "name", "username", "password", "comment"];

        var index = 0;

        $("#accountTable tr").eq(row).find("td").each(function (td) {
            if (index < 5) {
                if (!edit) {
                    $(this).wrapInner("<a href='#' class='table-"+attributes[index]+"'></a>");
                    index++;
                } else {
                    $(this).html($(this).text());
                    index++;
                }
            }
        });
        
        $(".table-name").editable(getEditableParams("name", this));
        $(".table-username").editable(getEditableParams("username", this));
        $(".table-password").editable(getEditableParams("password", this));
        $(".table-comment").editable(getEditableParams("comment", this));
        edit = !edit;
    },

    render: function() {     
        this.$el.html(this.template(this.model.toJSON()));  
        return this;
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

function reloadTable(collection) {
    var tables = $.fn.dataTable.fnTables(true);

    $(tables).each(function () {
        $(this).dataTable().fnDestroy();
    });
    $('#accountTable tbody').empty();

    collection.fetch({reset:true});

    //makeCopyable();
}

function makeCopyable() {

        table = $('#accountTable').DataTable();
        var tableData = table.rows().data();
        console.log(table.rows().count());

        var $tablerow = $("#accountTable tr");

        for (var i = 0; i <= table.rows().count(); i++) {

            $tablerow.eq(i).find("td").each(function (td) {
                if (td !== 5) {
                    $(this).click(function () {
                        console.log($(this).text());                       
                    });
                };
            });

        }
}