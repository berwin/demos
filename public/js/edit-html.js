'use strict';

define(function (require, exports, module) {
    var edit = require( './edit' );
    var pageEdit = require( './page-edit-html' );
    var id = pageEdit.id;

    var editor = pageEdit.editor;
    editor.setTheme("ace/theme/dawn");
    editor.setShowPrintMargin(false);
    editor.getSession().setMode("ace/mode/html");
    var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
    var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
    editor.setOption("enableEmmet", true);


    edit.initCode(id, editor);
    
    pageEdit.initView();


    var interval;
    editor.on( 'change', function() {
        if( window.frames[ 'result' ] ){
            clearTimeout( interval );
            interval = setTimeout( pageEdit.resetIframe, 300 );
        }

        edit.setLocalStorage( editor.getValue() );
    });

    function saveHTML () {
        window.frames[ 'result' ] && pageEdit.resetIframe();
        edit.sendCode( editor.getValue(), 'html' );
    }

    $( window ).keydown(function(event){
        //Save
        if( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ){
            saveHTML();
            return false;
        }

        //Toggle preview
        if( event.keyCode === 80 && ( event.ctrlKey === true || event.metaKey === true ) ){
            pageEdit.togglePreview();
            return false;
        }
    });

    //Save
    $( '#save' ).click( saveHTML );
    $( '#btn_preview' ).click( pageEdit.togglePreview );
});

if( window.console ) window.console.log( '本产品由 Berwin 独立开发\n开发者邮箱：berwin1995@qq.com\n开源地址：https://github.com/berwin/demo' );