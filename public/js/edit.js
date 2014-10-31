'use strict';

var editor = ace.edit("code");
editor.setTheme("ace/theme/chrome");
editor.setShowPrintMargin(false);
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

$( '#statusBar' ).get(0).onselectstart = function(){ return false };

$( window ).keydown(function(event){
    //Save
    if( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ){
        sendCode( editor );
        return false;
    }

    //Toggle preview
    if( event.keyCode === 80 && ( event.ctrlKey === true || event.metaKey === true ) ){
        togglePreview();
        return false;
    }
    window.localStorage[ id ] = editor.getValue();
});

//Save
$( '#save' ).click(function(){
    sendCode( editor );
});
//Toggle preview
$( '#btn_preview' ).click( togglePreview );

var interval;
editor.on( 'change', function() {
    if( window.frames[ 'result' ] ){
        clearTimeout( interval );
        interval = setTimeout( resetIframe, 300 );
    }
});

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
    var sw = $( '#scroll' ).width() / 2;
    $( '#code' ).width( w / 2 );
    $( '#preview' ).css( 'left', $( '#code' ).width() + 1 );
    $( '#scroll' ).css( 'left', w / 2 - sw + 'px' );

    resetIframe();
}

function drag( oScroll, oCode, oPreView, editorDragCover ){
    oScroll.onmousedown = function( ev ){
        var oEvent = ev || event;
        var disX = oEvent.clientX - oScroll.offsetLeft;
        editorDragCover.style.display = 'block';
        document.onmousemove = function( ev ){
            var oEvent = ev || event;
            var l = oEvent.clientX - disX;
            var sw = $( '#scroll' ).width() / 2;

            oCode.style.width = l + 'px';
            oScroll.style.left = l - sw + 'px';
            oPreView.style.left = l + 1 + 'px';
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

function togglePreview(){
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

function resetIframe(){
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

var sendCode = function( editor ){
    window.frames[ 'result' ] && resetIframe();
    window.localStorage.removeItem( id );
    var codeText = editor.getValue();
    $.post( '/createCode', { id : id, codeText : codeText } ).success(function( result ){
        if( result.status === 0 ) toastr.success( '保存成功' );
        if( result.status === -1 ) toastr.error( '保存失败' );
        if( result.status === 1 ) window.location.pathname = result.data._id;
    });
};

if( window.console ) window.console.log( '本产品由 Berwin 独立开发\n开发者邮箱：berwin1995@qq.com\n开源地址：https://github.com/berwin/demo' );