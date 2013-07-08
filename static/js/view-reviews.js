/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 1/29/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

$(function () {
    "use strict";


    var Item = Backbone.Model.extend({
        urlRoot: '/items'
    });
    var Items = Backbone.Collection.extend({
        url: '/items'
    });


    var CartItem = Backbone.Model.extend({
        urlRoot: '/cartitems'
    });

    var CartList = Backbone.Collection.extend({
        url: '/cartitems',
        model: CartItem,
        cartTotal: function () {
            return this.reduce(function(memo, value) { return memo +  parseFloat(value.get("Price")) }, 0.00);
        }
    });

    var ItemsList = Backbone.View.extend({

        events: {
            'click .btn-primary': 'addItem'
        },
        addItem: function (e) {
            var id = $(e.currentTarget).data("id");
            var found = myStoreItems.get(id);
            if (found) {
                var att = found.attributes;

                var item = myCart.find(function(item){
                    return item.get('Name') === att.Name;
                });

                if (item != null) {
                    var q = item.get("quantity");
                    var neQ = parseFloat(q) + 1;
                    item.set({quantity: neQ});
                    item.save();
                    cart.render();
                } else {
                    var newItem = new CartItem({
                        item_id: att.id,
                        Quantity: "1",
                        Name: att.Name,
                        Price: att.Price
                    });
                    newItem.save();
                    myCart.add(newItem);
                }
            }
        },
        render: function () {
            var that = this;
            myStoreItems.fetch({
                success: function (itmes) {
                    //that.$el.html("Whooohhooooooo");
                    var html = Handlebars.templates.review(myStoreItems.toJSON());
                    that.$el.html(html);
                }
            });
        }
    });

    var CartView = Backbone.View.extend({
        initialize: function () {
            this.listenTo(myCart, 'add', this.render);
            this.listenTo(myCart, 'remove', this.render);
            this.listenTo(myCart, 'update', this.render);
        },
        events: {
            'click .removeItem': 'removeItem'
        },
        render: function () {
            var that = this;
            myCart.fetch({
                success: function (itmes) {
                    var html = Handlebars.templates.cart(myCart.toJSON());
                    that.$el.html(html);
                    $("#totalPrice").html(myCart.cartTotal());
                }
            });
        },
        removeItem: function(e){
            var id = $(e.currentTarget).data("id");
            var item = myCart.get(id);
            item.destroy();
            return false;
        }
    });

    var ImageSelectionView = Backbone.View.extend({
        events: {
            'click #saveGallery': 'dispatchSaveGallery'
        }
    });

    var myStoreItems = new Items();
    var myCart = new CartList();
    var cart = new CartView({el: $("#right_basket")});
    var view = new ItemsList({el: $("#items")});


    var FormView = Backbone.View.extend({
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
    });



    var form = new FormView();

    view.render();
    cart.render();

});