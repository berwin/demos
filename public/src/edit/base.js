'use strict';

var menu = require('../menu/index.js');
var utils = require('../helper/utils.js');
var requester = require('../helper/requester.js');

var id = utils.getID();
var strType = utils.getType();

/*
 * 初始化code
 * 1. 获取code
 * 2. 将code添加到编辑器
 *
 * @param {String} id codeID
 * @param {Object} editor对象，编辑器实例
 */
exports.initCode = function (id, editor) {
  var cache = window.localStorage[id];
  if (cache) {
    editor.setValue(cache);
  } else {
    requester.edit.getCodeInfo(strType).success(function (codeInfo) {
      utils.setCookie('userID_' + id, codeInfo.userID);
      editor.setValue(codeInfo.code);
    });
  }
};

/*
 * 设置缓存
 * 将code缓存到localstorage中
 *
 * @param {String} code
 */
exports.setLocalStorage = function (value) {
  var usreID = utils.getCookie('userID');
  var codeUserID = utils.getCookie('userID_' + id);

  // 判断代码所属的用户ID和当前用户ID是否相同
  if (codeUserID === usreID || window.localStorage[id]) {
    window.localStorage[id] = value;
  }
};

/*
 * 注册拖拽事件
 * 
 * @param {Dom} 拖拽条
 * @param {Dom} 编辑器
 * @param {Dom} 预览界面
 * @param {Object} 编辑器实例
 */
exports.drag = function (oScroll, oCode, oPreView, editor) {
  oScroll.onmousedown = function (ev) {
    var oEvent = ev || event;
    var disX = oEvent.clientX - oScroll.offsetLeft;
    var sw = oScroll.offsetWidth;
    $('body').append('<div id="editor-drag-cover" style="display:block;"></div>');
    document.onmousemove = function (ev) {
      var w = document.body.clientWidth;
      var oEvent = ev || event;
      var l = oEvent.clientX - disX;
      oCode.style.width = l + 'px';
      oPreView.style.left = l + 1 + 'px';
      oPreView.style.width = w - l + 1 + 'px';
      oScroll.style.left = l - sw / 2 + 'px';
      editor.resize();
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      $('#editor-drag-cover').remove();
    };
    return false;
  };
}

/*
 * 初始化布局
 *
 * @param {Dom} 拖拽条
 * @param {Dom} 编辑器
 * @param {Dom} 预览界面
 */
exports.initLayout = function (left, center, right) {
  var w = document.body.clientWidth;
  left.width(w / 2);

  var l = left.width();
  var sw = center.width();
  var scw = center.find('span').width();
  right.css('left', l + scw + 'px');
  right.css('width', w - (l + scw) + 'px');
  center.css('left', l - sw / 2 + 'px');
};

/*
 * 保存或更新代码
 *
 * @param {String} code
 * @param {String} type [js|html]
 */
exports.sendCode = function (codeText, type) {
  window.localStorage.removeItem(id);
  NProgress.start();

  requester.edit.save(codeText, type).success(function (result) {
    /*if (result.status === 0 || result.status === 1) {
      toastr.success( '保存成功' );
    }*/
    if (result.status === 0 || result.status === 2 || result.nrm){
      menu.clearHistory();
    }
    if (result.status === 2) {
      window.location.pathname = strType + '/' + result.data._id;
    }
    NProgress.done();
  }).error(function (e) {
    toastr.error('保存失败');
    NProgress.done();
  });
};