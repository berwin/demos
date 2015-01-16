'use strict';

define(function (require, exports, module) {
    var tool = require( '../modules/tool' );
    var controller = require( './controller' );

    controller.load();

    $( '#btn_menu' ).click( controller.toggleMenu );

    $( '#mail' ).blur( controller.rmRedBorder );
    $( '#password' ).blur( controller.rmRedBorder );
    $( '#register_mail' ).blur( controller.rmRedBorder );
    $( '#retrieve_mail' ).blur( controller.rmRedBorder );

    $( '.register_link' ).click( controller.toRegister );
    $( '.login_link' ).click( controller.toLogin );
    $( '.retrieve_link' ).click( controller.toRetrieve );
    $( '#change_link' ).click( controller.toChangePw );
    $( '.backHome' ).click( controller.goHome );

    $( '#btn_login' ).click( controller.login );
    $( '#btn_register' ).click( controller.register );
    $( '#btn_retrieve' ).click( controller.retrieve );
    $( '#btn_changePw' ).click( controller.changePw );
    $( '#btn_signOut' ).click( controller.signOut );

    $( window ).keydown(function(event){
        //Show Menu
        if( event.keyCode === 77 && ( event.ctrlKey === true || event.metaKey === true ) ){
            controller.toggleMenu();
            return false;
        }
    })

    exports.getDemos = controller.getDemos;
    exports.appendChildDemos = controller.appendChildDemos;
    exports.cashe = controller.cashe;
});