/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 1/29/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

$(function () {
    "use strict";

     var GuestList = Backbone.View.extend({
        events: {
            'submit .confirm-attendance-form': 'confirmGuests'
        },
        render: function (items) {
            var html = Handlebars.templates.guest(items);
            this.$el.hide().html(html).slideDown();
            //$(rendered.el).appendTo(this.$el).hide().fadeIn().slideDown();
        },
        confirmGuests: function (ev) {
            var that = this;
            var activationFormCode = $(ev.currentTarget).serializeObject();
            $.post('/rsvp/confirmRVP', activationFormCode,
                function(data) {
                    confirmView.render();
                }, "json");
            return false;
        }
    });


    var ConfirmView = Backbone.View.extend({
        render: function (items) {
            var html = Handlebars.templates.confirm();
            this.$el.hide().html(html).slideDown();
        }
    });

    var guestForm = new GuestList({el: $("#guestFrom")});
    var confirmView = new ConfirmView({el: $("#confirm")});

    $(document).ready(function () {
        $(document).on('submit', '.activate-code-form', function (event) {
            event.preventDefault();

            $.post('/rsvp/code', $(this).serializeObject(), function (items) {
                if (items.length == 0) {
                    $("#guestFrom").append("Code niet bekend");
                } else {
                    $('#acticateControl').empty();
                    guestForm.render(items);
                }
            }, "json");

            event.preventDefault;
            return false;
        });
    });

});