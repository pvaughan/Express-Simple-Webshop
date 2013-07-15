/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 1/29/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

$(function () {
    "use strict";

    Handlebars.registerHelper('ifCostIsZero', function (options) {
        if (this.remainingStock > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

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
            'click .btn-purple': 'addItem'
        },
        addItem: function (e) {
            e.preventDefault();
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
                    item.save(null,{success : this.success});
                    cart.render();
                } else {
                    var newItem = new CartItem({
                        item_id: att.id,
                        Quantity: "1",
                        Name: att.Name,
                        Price: att.Price
                    });
                    newItem.save(null, {success : this.success});
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
        },
        success: function success(model, data) {
            //console.log("items Changed");
            if (data == null) {
                view.render();
                bootstrap_alert.warning('Dit artikel is niet meer beschikbaar');
            }
            else {
                cart.render();
            }


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
                    $("#totalPrice").html( "€ " + myCart.cartTotal() + ",-");
                }
            });
        },
        removeItem: function(e){
            var id = $(e.currentTarget).data("id");
            var item = myCart.get(id);
            item.destroy({
                "cache": false,
                "success": this.success
            });
            return false;
        },
        success: function success(model, data) {
            //console.log("itemRemoved");
            view.render();
            cart.render();
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

    cart.render();
    view.render();


});