import Reflux from 'reflux';
import $ from 'jquery';
import Config from 'config';

const SystemActions = Reflux.createActions([
    'alertSuccess',
    'alertError',
    'alertInfo',
    'alertWarning',
    'message'
    ]
);

const SystemStore = Reflux.createStore({
    listenables: [SystemActions],

    current:null,

    onAlertSuccess:function (message) {
        this.trigger('alertSuccess', message);
    },
    onAlertError:function (message) {
        this.trigger('alertError', message);
    },
    onAlertInfo:function (message) {
        this.trigger('alertInfo', message);
    },
    onAlertWarning:function (message) {
        this.trigger('alertWarning', message);
    },
    onMessage:function (message) {
        this.trigger('message',message);
    },

});


exports.SystemActions = SystemActions; 
exports.SystemStore = SystemStore;
