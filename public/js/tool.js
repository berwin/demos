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
    }
};

define(function (require, exports, module) {
    module.exports = util;
});