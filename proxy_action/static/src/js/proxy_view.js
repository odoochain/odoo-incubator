odoo.define('proxy_action.proxy_view', function (require) {
    'use strict';
    var ActionManager = require('web.ActionManager');
    var core = require('web.core')
    var _t = core._t

    ActionManager.include({

        _handleAction: function (action, options) {
            if (action.type == 'ir.actions.act_proxy') {
                return this._executeProxyAction(action, options);
            }
            return this._super.apply(this, arguments);
        },

        _executeProxyAction: function(action, options){
            var self = this;
            self.do_notify(_t('Proxy action executing'), _t('Your action is being executed'));
            var action_success = true;
            action.action_list.forEach(function (task) {
                $.ajax({
                    url: task['url'],
                    type: 'POST',
                    data: JSON.stringify(task['params']),
                    contentType: 'application/json',
                    async: false,
                }).done(function (result) {
                    console.log("Proxy action has been successfully sent: ", result);
                }).fail(function (result) {
                    console.log('Proxy action has failed: ', result);
                    action_success = false;
                })
            })
            if (action_success == true){
                self.do_notify(_t('Success'), _t('Proxy action successfully sent'));
            }
            else{
                self.do_warn(_t("Failure"), _t("Proxy action failure. Please check logs."));
            }
            action = { type: 'ir.actions.act_window_close' };
            return self.doAction(action, []);
        },
    });

});
