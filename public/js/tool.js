'use strict';

var util = {
    cashe : function () {
        var cashe = {};

        return {
            set : function (name, value) {
                cashe[ name ] = value;
            },
            get : function (name) {
                return cashe[ name ];
            },
            rm : function (name) {
                delete cashe[ name ];
            }
        };
    }
};

define(function (require, exports, module) {
    module.exports = util;
});