'use strict';

var util = {
    cashe : function () {
        var data = {};

        return {
            set : function (name, value) {
                data[ name ] = value;
            },
            get : function (name) {
                return data[ name ];
            },
            rm : function (name) {
                delete data[ name ];
            }
        };
    },
    regexp : function () {
        return {
            mail : /^([a-z0-9]+[\-|\_|\.]*[\w]*@[a-z0-9\-]+(\.[a-z]{2,3}){1,2})$/i
        }
    }
};

define(function (require, exports, module) {
    module.exports = util;
});