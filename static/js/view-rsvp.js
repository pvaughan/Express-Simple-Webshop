/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 1/29/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

$(function () {
    "use strict";

    var InvitationCode = Backbone.Model.extend({
            urlRoot: '/rsvp/code'
        });

    var FormView = Backbone.View.extend({
        el: $(".content"),
        events: {
            'submit .activate-code-form': 'postCode'
        },
        postCode: function (ev) {

            var that = this;
            var activationFormCode = $(ev.currentTarget).serializeObject();
            console.log(activationFormCode);
            //var code = new InvitationCode();
            //code.save(activationFormCode, {success: guestSuccess}); */

            $.post('/rsvp/code', activationFormCode,
                function(items){
                    //alert(data.toJSON());
                    //$('#lbl_code').disable();
                    if (items.length == 0) {
                        $("#guestFrom").append("Code niet bekend");
                    } else {
                        _gaq.push(['_trackEvent', 'RSVP Invite', activationFormCode, 'activation' ]);
                        $('#acticateControl').empty();
                        guestForm.render(items);
                    }
                }, "json");

            return false;
        },
        guestSuccess: function (item) {
            //alert(item.toJSON());

        },
        guestFailed: function() {
            alert("Code niet bekend");
        }
    });

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
                function(data){
                    alert('DONE');
                }, "json");
            confirmView.render();
            return false;
        }
    });


    var ConfirmView = Backbone.View.extend({

        render: function (items) {
            var html = Handlebars.templates.confirm();
            this.$el.hide().html(html).slideDown();
        }
    });

    var form = new FormView();
    var guestForm = new GuestList({el: $("#guestFrom")});
    var confirmView = new ConfirmView({el: $("#confirm")});

});