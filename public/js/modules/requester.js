'use strict';

define(function (require, exports, module) {

    var tool = require( './tool' );
    var id = tool.getID();

    var menu = {

        getList : function () {
            return $.post( '/getDemosByUserID', {id : id} );
        },

        getUserInfo : function () {
            return $.post( '/getUserInfo', {id : id} );
        },

        login : function (mail, password) {
            return $.post( '/login', {id : id, mail : mail, password: password} );
        },

        register : function (mail, password) {
            return $.post( '/register', {id : id, mail : mail, password : password} );
        },

        retrieve : function (mail) {
            return $.post( '/retrieve', { id : id, mail : mail } );
        },

        changepw : function (newPw) {
            return $.post( '/changepw', { id: id, password: newPw } );
        },

        signout : function () {
            return $.post( '/signout', {id: id} );
        },

        rmCode : function (id) {
            return $.post( '/rmCode/' + id, {id: id} );
        }
    };

    var edit = {
        getCodeInfo : function (type) {
            return $.get( '/getCodeInfo/'+ id +'/' + type );
        },

        save : function (codeText, type) {
            return $.post( '/createCode', { id : id, codeText : codeText, type: type } );
        }
    };

    module.exports = {
        menu : menu,
        edit : edit
    };

});