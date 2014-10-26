'use strict';

var editor = ace.edit("code");
editor.setTheme("ace/theme/monokai");
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

//Preview
initView();
$( '#statusBar' ).get(0).onselectstart = function(){ return false };

$( window ).keydown(function(event){
    //Save
    if( event.keyCode === 83 && event.ctrlKey ){
        sendCode( editor );
        return false;
    }
    if( event.keyCode === 83 && event.metaKey ){
        sendCode( editor );
        return false;
    }

    //Toggle preview
    if( event.keyCode === 80 && event.ctrlKey ){
        togglePreview();
        return false;
    }
    if( event.keyCode === 80 && event.metaKey ){
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

function initView () {
    var location = window.location.href;
    var html = '<div id="preview">'
        +'<iframe name="result" src="'+ location +'/result"></iframe>'
        +'<div id="editor-drag-cover"></div>'
        +'</div>'
        +'<div id="scroll"><span></span></div>';
    $( 'body' ).append( html );
    //Drag
    drag( $( '#scroll' ).get(0), $( '#code' ).get(0), $( '#preview' ).get(0), $( '#editor-drag-cover' ).get(0) );

    var w = document.body.clientWidth;
    $( '#code' ).width( w / 2 );
    $( '#preview' ).css( 'left', $( '#code' ).width() + $( '#scroll' ).width() );
    $( '#scroll' ).css( 'left', w / 2 + 'px' );
}

function drag( oScroll, oCode, oPreView, editorDragCover ){
    oScroll.onmousedown = function( ev ){
        var oEvent = ev || event;
        var disX = oEvent.clientX - oScroll.offsetLeft;
        editorDragCover.style.display = 'block';
        document.onmousemove = function( ev ){
            var oEvent = ev || event;
            var l = oEvent.clientX - disX;
            oCode.style.width = l + 'px';
            oScroll.style.left = l + 'px';
            oPreView.style.left = l + oScroll.offsetWidth + 'px';
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

var sendCode = function( editor ){
    window.localStorage.removeItem( id );
    var codeText = editor.getValue();
    $.post( '/createCode', { id : id, codeText : codeText } ).success(function( result ){
        if( result.status === 0 ){
            toastr.success( '保存成功' );
            window.frames[ 'result' ].location.reload();
        }
        if( result.status === -1 ) toastr.error( '保存失败' );
        if( result.status === 1 ){
            window.location.pathname = result.data._id;
        }
    });
};

if( window.console ) window.console.log( '本产品由 Berwin 独立开发\n开发者邮箱：berwin1995@qq.com\n开源地址：https://github.com/berwin/demo' );