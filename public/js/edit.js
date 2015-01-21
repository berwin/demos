'use strict';

define(function (require, exports, module) {
    var menu = require( './menu/menu' );
    var tool = require( './modules/tool' );
    var requester = require( './modules/requester' );

    var id = tool.getID();
    var strType = tool.getType();
    

    exports.initCode = function (id, editor) {

        var url = '/' + id + '/result/' + strType;

        var cache = window.localStorage[ id ];
        if( cache  ){
            editor.setValue( cache );
        }else{
            requester.edit.getCodeInfo( strType ).success(function( codeInfo ){
                tool.setCookie( 'userID_' + id, codeInfo.userID );
                editor.setValue( codeInfo.codeText );
            });
        }
    };

    exports.setLocalStorage = function (value) {
        var usreID = tool.getCookie( 'userID' );
        var codeUserID = tool.getCookie( 'userID_' + id );

        if (codeUserID === usreID) {
            window.localStorage[ id ] = value;
        }
    };

    exports.drag = function (oScroll, oCode, oPreView, editor) {
        oScroll.onmousedown = function( ev ){
            var oEvent = ev || event;
            var disX = oEvent.clientX - oScroll.offsetLeft;
            var sw = oScroll.offsetWidth;
            $('body').append('<div id="editor-drag-cover" style="display:block;"></div>');
            document.onmousemove = function( ev ){
                var w = document.body.clientWidth;

                var oEvent = ev || event;
                var l = oEvent.clientX - disX;
                oCode.style.width = l + 'px';
                oPreView.style.left = l + 1 + 'px';
                oPreView.style.width = w - l + 1 + 'px';
                oScroll.style.left = l - sw / 2 + 'px';
                editor.resize();
            };
            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
                $( '#editor-drag-cover' ).remove();
            };
            return false;
        };
    }

    exports.initLayout = function (left, center, right) {
        var w = document.body.clientWidth;
        left.width( w / 2 );

        var l = left.width();
        var sw = center.width();
        var scw = center.find('span').width();
        right.css( 'left', l + scw + 'px' );
        right.css( 'width', w - (l + scw) + 'px' );
        center.css( 'left', l - sw / 2 + 'px' );
    };

    exports.sendCode = function (codeText, type) {
        window.localStorage.removeItem( id );

        NProgress.start();

        requester.edit.save( codeText, type ).success( function (result) {
            // if (result.status === 0 || result.status === 1) toastr.success( '保存成功' );

            if (result.status === 0 || result.status === 2){
                menu.clearHistory();
            }
            
            if (result.status === 2) window.location.pathname = strType + '/' + result.data._id;

            NProgress.done();
        } ).error(function(e){

            toastr.error( '保存失败' );

            NProgress.done();
        });
    };
});