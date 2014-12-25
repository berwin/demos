'use strict';

define(function (require, exports, module) {
    var editor = ace.edit("code");
    var id = window.location.pathname.substring( 6 );
    var tool = require( './tool' );
    var menu = require( './menu' );
    var edit = require( './edit' );

    function initView () {
        var html = '<div id="preview">'
            +'<iframe name="result"></iframe>'
            +'</div>'
            +'<div id="scroll"><span></span></div>';
        $( 'body' ).append( html );

        //Drag
        edit.drag( $( '#scroll' ).get(0), $( '#code' ).get(0), $( '#preview' ).get(0), editor );

        //Scroll And Preview
        edit.initLayout( $( '#code' ), $( '#scroll' ), $( '#preview' ) );

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

    exports.resetIframe = resetIframe;
    exports.editor = editor;
    exports.id = id;
    exports.initView = initView;
});