'use strict';

var editor = ace.edit("code");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/html");
var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
editor.setOption("enableEmmet", true);

var id = window.location.pathname.substring( 1 );

var cache = window.localStorage[ id ];
if( cache  ){
    editor.setValue( cache );
}else{
    $.get( '/' + id + '/result' ).success(function( codeText ){
        editor.setValue( codeText );
    });
}

$( window ).keydown(function(event){
    if( event.keyCode === 83 && event.ctrlKey ){
        sendCode( editor );
        return false;
    }
    if( event.keyCode === 83 && event.metaKey ){
        sendCode( editor );
        return false;
    }
    window.localStorage[ id ] = editor.getValue();
});

$( '#save' ).click(function(){
    sendCode( editor );
});

var sendCode = function( editor ){
    window.localStorage.removeItem( id );
    var codeText = editor.getValue();
    $.post( '/createCode', { id : id, codeText : codeText } ).success(function( result ){
        if( result.status === 0 ) toastr.success( '保存成功' );
        if( result.status === -1 ) toastr.error( '保存失败' );
        if( result.status === 1 ){
            window.location.pathname = result.data._id;
        }
    });
};

if( window.console ) window.console.log( '本产品由 Berwin 独立开发\n开发者邮箱：berwin1995@qq.com\n开源地址：https://github.com/berwin/demo' );