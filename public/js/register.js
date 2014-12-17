'use strict';

define(function (require, exports, module) {
    var tool = require( './tool' );
    var id = window.location.pathname.split( '/' )[1];
    $( '#btn' ).click(function () {
        var mail = $( '#email' ).val();
        var password = $( '#password' ).val();

        $( '#register' ).addClass('fadeOut animated');
        $( 'body' ).append('<div id="loading"><div class="outer"></div><div class="inner"></div></div>');
        
        if( !tool.regexp().mail.test( mail ) ){
            clear();
            toastr.error( '请输入正确的邮箱地址' );
        }else{
            $.post( '/register', { mail : mail, password : password, id : id } ).success(function () {
                $( '#loading' ).remove();
                $('body').append('<h1 class="register_h1 bounceInDown animated">我们已经成功向您的邮箱发送了一封激活邮件，请点击邮件中的链接完成注册！<a href="/'+ id +'">点击返回编辑代码</a></h1>');
            }).error(function (msg) {
                clear();
                toastr.error( msg.responseText );
            });
        }
    });
    function clear () {
        $( '#register' ).removeClass('fadeOut');
        $( '#register' ).removeClass('animated');
        $( '#loading' ).remove();
        
    }
});