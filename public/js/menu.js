'use strict';

define(function (require, exports, module) {
    var tool = require( './tool' );
    var cashe = tool.cashe();
    var id = window.location.pathname.substring( 1 );
    var cookie = tool.cookieToObject( document.cookie );

    function getDemos (callback) {
        var history = cashe.get('history');
        if( history ){
            callback(history);
        }else{
            $.post('/getDemosByUserID', {id : id} ).success(function (list) {
                cashe.set('history', list);
                callback(list);
            });
        }
    }
    function appendChildDemos (list) {
        var ul = document.createElement('ul');
        var pathname = window.location.pathname.substring(1);
        for( var i = 0; i < list.length; i++ ){
            var classActive = ( list[i]._id === pathname ? 'on' : '' );
            var str = '<li><a href="/'+ list[i]._id +'" class="'+ classActive +'">'+ list[i]._id +'</a></li>';
            $( ul ).append( str );
        }
        $( '#history' ).html('');
        $( '#history' ).append( ul );
    }

    function getUserInfo (callback) {
        var userInfo = cashe.get( 'userInfo' );
        if( userInfo ){
            callback( userInfo );
        }else{
            $.post('/getUserInfo', {id : id}).success(function (userInfo) {
                cashe.set( 'userInfo', userInfo );
                callback(userInfo);
            });
        }
    }
    function getUserInfoInit (userInfo) {
        userInfo.avatar && $( '#avatar' ).attr( 'src', userInfo.avatar );
        $( '#account' ).remove();
        cashe.rm('history');
        getDemos( appendChildDemos );
    }

    function login () {
        var regexpMail = tool.regexp().mail;
        var mail = $( '#mail' ).val();
        var password = $( '#password' ).val();
        if( regexpMail.test( mail ) && password ){
            $.post('/login', {id : id, mail : mail, password: password}).success(function (userInfo) {
                getUserInfoInit(userInfo);
                toastr.success( '登陆成功' );
            }).error(function (msg) {
                toastr.error( msg.responseText );
            });
        }
        if( !regexpMail.test( mail ) ) $( '#mail' ).addClass('redBorder');
        if( !password ) $( '#password' ).addClass('redBorder');
    }

    function register () {
        var mail = $( '#register_mail' ).val();
        var password = $( '#register_password' ).val();

        $( '#register' ).addClass('fadeOut animated');
        $( 'body' ).append('<div id="loading"><div class="outer"></div><div class="inner"></div></div>');
        
        if( !tool.regexp().mail.test( mail ) ){
            $( '#loading' ).remove();
            toastr.error( '请输入正确的邮箱地址' );
        }else{
            $.post( '/register', { mail : mail, password : password, id : id } ).success(function () {
                $( '#loading' ).remove();
                toLogin();
                toastr.success( '我们已经成功向您的邮箱发送了一封激活邮件，请点击邮件中的链接完成注册！' );
            }).error(function (msg) {
                $( '#loading' ).remove();
                toastr.error( msg.responseText );
            });
        }
    }

    function toRegister () {
        $( '#register' ).get(0).className = 'animated flipInY';
        $( '#login' ).get(0).className = 'none';
    }
    function toLogin () {
        $( '#login' ).get(0).className = 'animated flipInY';
        $( '#register' ).get(0).className = 'none';
    }
    function toClose () {
        if ($( '#login' ).get(0)) $( '#login' ).get(0).className = '';
        if ($( '#register' ).get(0)) $( '#register' ).get(0).className = 'none';
    }

    function toggleMenu () {
        var menu = $( '#menu' ).get( 0 );
        var menuShow = function(){
            $( '#menu' ).addClass( 'fadeinleft' );
            $( '#menu' ).removeClass( 'none' );
            getDemos( appendChildDemos );
        };
        var menuHide = function(){
            $('#menu').get(0).className = 'fadeoutleft';
            toClose();
            setTimeout(function(){
                $( '#menu' ).get(0).className = 'none';
            },700);
        };

        if (menu.className.indexOf( 'none' ) === -1) {
            menuHide();
        }else{
            menuShow();
        }
    }

    function rmRedBorder () {
        $(this).removeClass( 'redBorder' );
    }

    if( cookie && cookie.login_session ){
        getUserInfo( getUserInfoInit );
    }

    $( '#btn_menu' ).click( toggleMenu );

    $( '#mail' ).blur( rmRedBorder );
    $( '#password' ).blur( rmRedBorder );

    $( '#register_link' ).click( toRegister );
    $( '#login_link' ).click(toLogin);

    $( '#btn_login' ).click( login );
    $( '#btn_register' ).click( register );

    exports.toggleMenu = toggleMenu;
    exports.getDemos = getDemos;
    exports.appendChildDemos = appendChildDemos;
    exports.cashe = cashe;
});