'use strict';

var editor = ace.edit('code');
var edit = require('../base.js');

/*
 * 初始化整体界面
 */
function initView() {
  // 添加预览界面
  $('body').append('<div id="preview"><iframe name="result"></iframe></div><div id="scroll"><span></span></div>');

  // 给滚动条注册拖拽事件
  edit.drag($('#scroll').get(0), $('#code').get(0), $('#preview').get(0), editor);

  // 计算并设置各个区域宽度
  edit.initLayout($('#code'), $('#scroll'), $('#preview'));

  // 重新渲染预览界面
  resetIframe();
}

/*
 * 重置预览界面
 */
function resetIframe() {
  var preview = document.getElementById('preview');
  preview.removeChild(preview.getElementsByTagName('iframe')[0]);
  var iframe = document.createElement('iframe');
  iframe.setAttribute('name', 'result');
  preview.appendChild(iframe);

  var codeText = editor.getValue();
  var content = window.frames['result'].document;
  content.open();
  content.write(codeText);
  content.close();
}    

/*
 * 切换预览界面 - 显示和隐藏
 */
function togglePreview() {
  var preview = $('#preview').get(0);
  var scroll = $('#scroll').get(0);
  if (preview && scroll) {
    $('#preview').remove();
    $('#scroll').remove();
    $('#code').width('100%');
  } else {
    initView();
  }

  editor.resize();
}

exports.togglePreview = togglePreview;
exports.resetIframe = resetIframe;
exports.editor = editor;
exports.initView = initView;