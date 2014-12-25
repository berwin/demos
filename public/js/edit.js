'use strict';

define(function (require, exports, module) {
    var menu = require('./menu');

    exports.initCode = function (id, editor) {
        var cache = window.localStorage[ id ];
        if( cache  ){
            editor.setValue( cache );
        }else{
            $.get( '/' + id + '/result' ).success(function( codeText ){
                editor.setValue( codeText );
            });
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

    exports.sendCode = function (id, codeText, type) {
        window.localStorage.removeItem( id );
        $.post( '/createCode', { id : id, codeText : codeText, type: type } ).success( function (result) {
            if (result.status === 0 || result.status === 1) toastr.success( '保存成功' );
            if (result.status === 0 || result.status === 2){
                menu.cashe.rm('history');
                menu.getDemos( menu.appendChildDemos );
            }
            if (result.status === 2) window.location.pathname = 'html/' + result.data._id;
        } ).error(function(e){
            toastr.error( '保存失败' );
        });
    };
});