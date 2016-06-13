'use strict';

var edit = require('../base.js');
var consoleJS = require('./consoleJS.js');
var id = window.location.pathname.substring(4);

// 编辑器个性化配置
var editor = ace.edit("code");
editor.setTheme('ace/theme/dawn');
editor.setShowPrintMargin(false);
editor.getSession().setMode('ace/mode/javascript');
var StatusBar = ace.require('ace/ext/statusbar').StatusBar;
var statusBar = new StatusBar(editor, document.getElementById('statusBar'));
editor.setOption('enableEmmet', true);

// 初始化编辑器
edit.initCode(id, editor);

// 给滚动条注册拖拽事件
edit.drag($('#scroll').get(0), $('#code').get(0), $('#repl').get(0), editor);

// 计算并设置各个区域宽度
edit.initLayout($('#code'), $('#scroll'), $('#repl'));

editor.on('change', function() {
  edit.setLocalStorage(editor.getValue());
});

/*
 * 保存code
 */
function saveCode() {
  var code = editor.getValue();
  edit.sendCode(code, 'js');
}

/*
 * 执行js
 */
function runCode() {
  var code = editor.getValue();
  consoleJS.handler(code);
  focusAndBlur();
}

/*
 * 重新渲染视图
 */
function focusAndBlur() {
  $('.jqconsole').removeClass('jqconsole-blurred');
  setTimeout(function () {
    $('.jqconsole').addClass('jqconsole-blurred');
  }, 100);
}

/*
 * 快捷键
 */
$('#code').keydown(function (event) {
  // 运行
  if (event.keyCode === 13 && (event.ctrlKey === true || event.metaKey === true)) {
    runCode();
    return false;
  }
  // 保存
  if (event.keyCode === 83 && (event.ctrlKey === true || event.metaKey === true)) {
    saveCode();
    return false;
  }

  // 清屏
  if (event.keyCode === 75 && (event.ctrlKey === true || event.metaKey === true)) {
    consoleJS.jqconsole.Clear();
  }
});

/*
 * 按钮 - 保存和运行和清屏
 */
$('#cls').click(function () {
  consoleJS.jqconsole.Clear();
});
$('#save').click(saveCode);
$('#run').click(runCode);