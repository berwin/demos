'use strict';

define(function (require, exports, module) {
    var editor = ace.edit("code");
    var id = window.location.pathname.substring( 1 );
    var tool = require( './tool' );
    var cashe = tool.cashe();

    function initView () {
        var html = '<div id="preview">'
            +'<iframe name="result"></iframe>'
            +'<div id="editor-drag-cover"></div>'
            +'</div>'
            +'<div id="scroll"><span></span></div>';
        $( 'body' ).append( html );
        //Drag
        drag( $( '#scroll' ).get(0), $( '#code' ).get(0), $( '#preview' ).get(0), $( '#editor-drag-cover' ).get(0) );

        var w = document.body.clientWidth;
        $( '#code' ).width( w / 2 );

        var l = $( '#code' ).width();
        var sw = $( '#scroll' ).width();
        var scw = $( '#scroll span' ).width();
        $( '#preview' ).css( 'left', l + scw + 'px' );
        $( '#scroll' ).css( 'left', l - sw / 2 + 'px' );

        resetIframe();
    }
    function resetIframe () {
        var preview = document.getElementById( 'preview' );
        preview.removeChild( preview.getElementsByTagName( 'iframe' )[0] );
        var iframe = document.createElement( 'iframe' );
        iframe.setAttribute( 'name', 'result' );
        preview.appendChild( iframe );

        var codeText = editor.getValue();
        var content = window.frames[ 'result' ].document;
        content.open();
        content.write( codeText );
        content.close();
    }
    function drag (oScroll, oCode, oPreView, editorDragCover) {
        oScroll.onmousedown = function( ev ){
            var oEvent = ev || event;
            var disX = oEvent.clientX - oScroll.offsetLeft;
            var sw = oScroll.offsetWidth;
            editorDragCover.style.display = 'block';
            document.onmousemove = function( ev ){
                var oEvent = ev || event;
                var l = oEvent.clientX - disX;
                oCode.style.width = l + 'px';
                oPreView.style.left = l + 1 + 'px';
                oScroll.style.left = l - sw / 2 + 'px';
                editor.resize();
            };
            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
                editorDragCover.style.display = 'none';
            };
            return false;
        };
    }

    function getUserInfo (callback) {
        var userInfo = cashe.get( 'userInfo' );
        if( userInfo ){
            callback( userInfo )
        }else{
            $.post('/getUserInfo', {id : id}).success(function (userInfo) {
                cashe.set( 'userInfo', userInfo );
                callback(userInfo);
            });
        }
    }

    exports.togglePreview = function () {
        var preview = $( '#preview' ).get( 0 );
        var scroll = $( '#scroll' ).get( 0 );
        if( preview && scroll ){
            $( '#preview' ).remove();
            $( '#scroll' ).remove();
            $( '#code' ).width( '100%' );
        }else{
            initView();
        }
        editor.resize();
    }

    exports.sendCode = function () {
        window.frames[ 'result' ] && resetIframe();
        window.localStorage.removeItem( id );
        var codeText = editor.getValue();
        $.post( '/createCode', { id : id, codeText : codeText } ).success(function( result ){
            if (result.status === 0 || result.status === 1) toastr.success( '保存成功' );
            if (result.status === 0 || result.status === 2) cashe.rm('history');
            if (result.status === 2) window.location.pathname = result.data._id;
        }).error(function(e){
            toastr.error( '保存失败' );
        });
    };

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

    exports.toggleMenu = function () {
        var menu = $( '#menu' ).get( 0 );
        var menuShow = function(){
            $( '#menu' ).addClass( 'fadeinleft' );
            $( '#menu' ).removeClass( 'none' );
            getDemos( appendChildDemos );
            getUserInfo(function (userInfo) {
                $( '#avatar' ).attr( 'src', userInfo.avatar );
                $( '#b' ).remove();
            });
        };
        var menuHide = function(){
            $('#menu').get(0).className = 'fadeoutleft';
            setTimeout(function(){
                $( '#menu' ).get(0).className = 'none';
            },700);
        };
        if (menu.className.indexOf( 'none' ) === -1) {
            menuHide();
        }else{
            menuShow();
        }
    };

    exports.rmRedBorder = function () {
        $(this).removeClass( 'redBorder' );
    };

    exports.login = function () {
        var regexpMail = tool.regexp().mail;
        var mail = $( '#mail' ).val();
        var password = $( '#password' ).val();
        if( regexpMail.test( mail ) && password ){
            $.post('/login', {id : id, mail : mail, password: password}).success(function (userInfo) {
                $( '#avatar' ).attr( 'src', userInfo.avatar );
                $( '#b' ).remove();
                cashe.rm( 'userInfo' );
                cashe.rm('history');
                getDemos( appendChildDemos );
                toastr.success( '登陆成功' );
            }).error(function (msg) {
                toastr.error( msg.responseText );
            });
        }
        if( !regexpMail.test( mail ) ) $( '#mail' ).addClass('redBorder');
        if( !password ) $( '#password' ).addClass('redBorder');
    };


    exports.resetIframe = resetIframe;
    exports.editor = editor;
    exports.id = id;
    exports.initView = initView;
});