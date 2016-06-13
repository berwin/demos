'use strict';

var edit = require('../base.js');
var pageEdit = require('./core.js');
var id = window.location.pathname.substring(6);

// 编辑器个性化配置
var editor = pageEdit.editor;
editor.setTheme('ace/theme/dawn');
editor.setShowPrintMargin(false);
editor.setOption('enableEmmet', true);
editor.getSession().setMode('ace/mode/html');
var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
var statusBar = new StatusBar(editor, document.getElementById('statusBar'));

// 初始化编辑器
edit.initCode(id, editor);

// 初始化预览界面
pageEdit.initView();

/*
 * 保存HTML
 * 将code保存到服务器（如果有开启了预览界面，会先重新渲染预览界面）
 */
function saveHTML() {
  if (window.frames['result']) {
    pageEdit.resetIframe();
  }
  edit.sendCode(editor.getValue(), 'html');
}

/*
 * 实时预览功能
 */
var interval = null;
editor.on('change', function() {
  // 重新渲染预览界面
  if (window.frames['result']) {
    clearTimeout(interval);
    interval = setTimeout(pageEdit.resetIframe, 300);
  }

  // 将代码缓存到localstorage中
  edit.setLocalStorage(editor.getValue());
});

/*
 * 快捷键 - 保存和实时预览
 */
$(window).keydown(function (event) {
  // 保存code快捷键 Ctrl|Command + S
  if( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ){
    saveHTML();
    return false;
  }

  // 切换预览页面 Ctrl|Command + P
  if( event.keyCode === 80 && ( event.ctrlKey === true || event.metaKey === true ) ){
    pageEdit.togglePreview();
    return false;
  }
});

/*
 * 按钮 - 保存和实时预览
 */
$('#save').click(saveHTML);
$('#btn_preview').click(pageEdit.togglePreview);

if(window.console) window.console.log('本产品由 Berwin 独立开发\n开发者邮箱：liubowen.niubi@gmail.com\n开源地址：https://github.com/berwin/demo');