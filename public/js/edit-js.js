'use strict';

define(function (require, exports, module) {
    var edit = require( './edit' );
    var consoleJS = require( './consoleJS' );

    var id = window.location.pathname.substring( 4 );
    var editor = ace.edit("code");
    editor.setTheme("ace/theme/dawn");
    editor.setShowPrintMargin(false);
    editor.getSession().setMode("ace/mode/javascript");
    var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
    var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
    editor.setOption("enableEmmet", true);

    edit.initCode(id, editor);

    edit.drag( $( '#scroll' ).get(0), $( '#code' ).get(0), $( '#repl' ).get(0), editor );
    edit.initLayout( $('#code'), $('#scroll'), $('#repl') );


    function saveCode () {
        var code = editor.getValue();
        edit.sendCode(code, 'js');
    }

    function runCode () {
        var code = editor.getValue();
        consoleJS.handler( code );
        focusAndBlur();
    }

    function focusAndBlur () {
        $( '.jqconsole' ).removeClass( 'jqconsole-blurred' );
        setTimeout(function () {
            $( '.jqconsole' ).addClass( 'jqconsole-blurred' );
        }, 100);
    }

    $( '#code' ).keydown(function (event) {
        // Run
        if( event.keyCode === 13 && ( event.ctrlKey === true || event.metaKey === true ) ){
            runCode();
            return false;
        }
        //Save
        if( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ){
            saveCode();
            return false;
        }
        window.localStorage[ id ] = editor.getValue();
    });

    $( '#save' ).click( saveCode );
    $( '#run' ).click( runCode );
});