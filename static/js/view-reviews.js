/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 1/29/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

$(function () {
    "use strict";



    var Items = Backbone.Collection.extend({
            url: '/items'
        }),
        Item = Backbone.Model.extend({
            urlRoot: '/items'
        }),
        ItemsList = Backbone.View.extend({
            render: function () {
                var that = this;
                var items = new Items();
                items.fetch({
                    success: function (itmes) {
                        //that.$el.html("Whooohhooooooo");


                        var html = Handlebars.templates.review(items.toJSON());
                        that.$el.html(html);
                    }
                })
            }
        }),

        ImageSelectionView = Backbone.View.extend({
        events: {

            'click #saveGallery': 'dispatchSaveGallery'
        }
        }),

        view = new ItemsList({el: $("#items")}),


        FormView = Backbone.View.extend({
            el: $(".container"),
            events: {
                'submit .add-item-form': 'postMessage',
                'change #myGallery': 'dispatchUpdateGalleryPreview'
            },
            dispatchUpdateGalleryPreview: function(e) {
                this.collection.setFromFiles(e.target.files);
            },
            postMessage: function (ev) {

                var that = this;

                var itemDetails = $(ev.currentTarget).serializeObject();
                console.log(itemDetails);
                var item = new Item();
                item.save(itemDetails, function (item) {
                    alert(item.toJSON());
                });
                view.render();
                return false;
            }
        }),



        form = new FormView();

    view.render();

});