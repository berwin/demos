(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../helper/requester.js":4,"../helper/utils.js":5,"../menu/index.js":7}],2:[function(require,module,exports){
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
},{"../base.js":1}],3:[function(require,module,exports){
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
},{"../base.js":1,"./core.js":2}],4:[function(require,module,exports){
'use strict';

var tool = require('./utils.js');
var id = tool.getID();

var menu = {
  getList: function () {
    return $.get('/api/code');
  },
  getUserInfo: function () {
    return $.get('/api/user');
  },
  login: function (mail, password) {
    return $.post('/api/login', {id: id, mail: mail, password: password});
  },
  register: function (mail, password) {
    return $.post('/api/user', {id: id, mail: mail, password: password});
  },
  retrieve: function (mail) {
    return $.post('/api/retrieve', {id : id, mail: mail});
  },
  changepw: function (newPw) {
    return $.ajax({
      url: '/api/user',
      type: 'PUT',
      data: {id: id, password: newPw}
    });
  },
  signout: function () {
    return $.get('/api/signout', {id: id});
  },
  rmCode: function (id) {
    return $.ajax({
      url: '/api/code/' + id,
      type: 'DELETE'
    });
  }
};

var edit = {
  getCodeInfo: function (type) {
    return $.get('/api/code/'+ id +'/' + type);
  },
  save: function (codeText, type) {
    return $.post('/api/code', {id: id, code: codeText, type: type});
  }
};

module.exports = {
  menu: menu,
  edit: edit
};
},{"./utils.js":5}],5:[function(require,module,exports){
'use strict';

module.exports = {
  cashe: function () {
    var data = {};

    return {
      set: function (name, value) {
        data[name] = value;
      },
      get: function (name) {
        return data[name];
      },
      rm: function (name) {
        delete data[name];
      }
    };
  },
  regexp: function () {
    return {
      mail : /^([a-z0-9]+[\-|\_|\.]*[\w]*@[a-z0-9\-]+(\.[a-z]{2,3}){1,2})$/i
    }
  },
  cookieToObject: function (str) {
    var obj = {};
    var arr = str.split('; ');
    for (var i = 0; i < arr.length; i++) {
      var aCookie = arr[i].split('=');
      obj[aCookie[0]] = aCookie[1];
    }
    return obj;
  },
  getCookie: function (name) {
    var arr = document.cookie.split('; ');
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('=');
      if (arr2[0] === name) {
        return arr2[1];
      }
    }
    return '';
  },
  setCookie: function (name, value, time) {
    var str = name + '=' + encodeURIComponent(value);
    if (time) {
      var oDate = new Date();
      oDate.setDate(oDate.getDate() + time);
      str += ';expires=' + oDate;
    }
    document.cookie = str;
  },
  getType: function () {
    var pathname = window.location.pathname;
    var type = '';
    if( pathname.indexOf('/js/') === 0 ) type = 'js';
    if( pathname.indexOf('/html/') === 0 ) type = 'html';
    return type;
  },
  getID: function () {
    var id = '';
    var pathname = window.location.pathname;
    if (pathname.indexOf('/js/') === 0) id = pathname.substring(4);
    if (pathname.indexOf('/html/') === 0) id = pathname.substring(6);
    return id;
  }
};
},{}],6:[function(require,module,exports){
'use strict';

var requester = require('../helper/requester.js');
var utils = require('../helper/utils.js');

var cashe = utils.cashe();
var id = utils.getID();
var cookie = utils.cookieToObject(document.cookie);

/*
 * 获取历史demo列表
 *
 * @param {Function} callback
 * @callback {Array} list
 */
function getDemos(callback) {
  var history = cashe.get('history');
  if (history) {
    callback(history);
  } else {
    requester.menu.getList().success(function (list) {
      cashe.set('history', list);
      callback(list);
    });
  }
}

/*
 * 将demo插入到列表中
 *
 * @param {Array} 数据列表
 */
function appendChildDemos(list) {
  var ul = document.createElement('ul');

  for (var i = 0; i < list.length; i++) {
    var classActive = (list[i]._id === id ? 'on' : '');
    var str = '<li><div class="del_history none"><img src="/images/close.png" /></div><a href="/'+ list[i].type +'/'+ list[i]._id +'" class="'+ classActive +'" _id="'+ list[i]._id +'">'+ (list[i].alias || list[i]._id) +'.'+ list[i].type +'</a></li>';
    $(ul).append(str);
  }

  $('#history').html('');
  $('#history').append(ul);
}

/*
 * 清除缓存，并重新渲染列表
 */
function clearHistory() {
  cashe.rm('history');
  getDemos(appendChildDemos);
}

/*
 * 初始化登录框顺序
 */
function toClose() {
  var login = $('#login').get(0);
  var register = $('#register').get(0);
  var retrieve = $('#retrieve').get(0);

  if (login) {
    login.className = '';
  }
  if (register) {
    register.className = 'none';
  }
  if (retrieve) {
    retrieve.className = 'none';
  }

  $('#login_after_btn').get(0).className = '';
  $('#changePw').get(0).className = 'none';
}

/*
 * 切换菜单状态
 */
function toggleMenu() {
  var menu = $('#menu').get(0);

  function menuShow() {
    $('#menu').addClass('fadeinleft').removeClass('none');
    getDemos(appendChildDemos);
  };

  function menuHide() {
    $('#menu').get(0).className = 'fadeoutleft';
    toClose();
    setTimeout(function(){
      $('#menu').get(0).className = 'none';
    },700);
  };

  if (menu.className.indexOf('none') === -1) {
    menuHide();
  }else{
    menuShow();
  }
}

/*
 * 清除输入框的红色边框
 */
function rmRedBorder() {
  $(this).removeClass('redBorder');
}

/*
 * 切换登陆框面板
 */
function transform(name) {
  $('#retrieve').get(0).className = 'none';
  $('#register').get(0).className = 'none';
  $('#login').get(0).className = 'none';
  $('#' + name).get(0).className = 'animated flipInY';
}

/*
 * 切换到注册面板
 */
function toRegister() {
  transform('register');
}

/*
 * 切换到登陆面板
 */
function toLogin() {
  transform('login');
}

/*
 * 切换到找回密码面板
 */
function toRetrieve() {
  transform('retrieve');
}

/*
 * 显示修改密码面板
 */
function toChangePw() {
  $('#login_after_btn').get(0).className = 'animated zoomOutDown';
  setTimeout(function () {
    $('#changePw').get(0).className = 'animated bounceInDown';
  }, 1000);
}

// 返回到登陆主页面板
function goHome() {
  $( '#changePw' ).get(0).className = 'animated bounceOutUp';
  setTimeout(function () {
    $('#login_after_btn').get(0).className = 'animated zoomInUp';
  }, 500);
}

/*
 * 渲染菜单
 */
function renderMenu(userInfo) {
  if (userInfo.avatar) {
    $('#avatar').attr('src', userInfo.avatar);
  }

  $('#login_before').addClass('none');
  $('#login_after').removeClass('none');

  cashe.rm('history');
  getDemos(appendChildDemos);
}

/*
 * 获取用户信息
 */
function getUserInfo(callback) {
  var userInfo = cashe.get('userInfo');
  if (userInfo) {
    callback(userInfo);
  }else{
    requester.menu.getUserInfo().success(function (userInfo) {
      cashe.set('userInfo', userInfo);
      callback(userInfo);
    });
  }
}

/*
 * 加载用户信息
 */
function load() {
  if (cookie && cookie.login_session) {
    getUserInfo(renderMenu);
  }
}

/*
 * 显示loading
 */
function addLoading() {
  $('body').append('<div id="loading"><div class="outer"></div><div class="inner"></div></div>');
}
/*
 * 隐藏loading
 */
function rmLoading() {
  $('#loading').remove();
}

/*
 * 登陆
 */
function login() {
  var regexpMail = utils.regexp().mail;
  var mail = $('#mail').val();
  var password = $('#password').val();

  if (regexpMail.test(mail) && password) {
    requester.menu.login(mail, password).success(function (userInfo) {
      renderMenu(userInfo);
      $('#password').val('');
      toastr.success('登陆成功');
    }).error(function (msg) {
      toastr.error(msg.responseText);
    });
  }

  if (!regexpMail.test(mail)) {
    $( '#mail' ).addClass('redBorder');
  }
  if (!password) {
    $('#password').addClass('redBorder');
  }
}

/*
 * 注册
 */
function register() {
  var mail = $('#register_mail').val();
  var password = $('#register_password').val();
  addLoading();
  
  if (utils.regexp().mail.test(mail)) {
    requester.menu.register(mail, password).success(function () {
      rmLoading();
      toLogin();
      toastr.success('我们已经成功向您的邮箱发送了一封激活邮件，请点击邮件中的链接完成注册！');
    }).error(function (msg) {
      rmLoading();
      toastr.error(msg.responseText);
    });
  }else{
    rmLoading();
    $('#register_mail').addClass('redBorder');
  }
}

/*
 * 找回密码
 */
function retrieve() {
  var mail = $('#retrieve_mail').val();
  addLoading();

  if(utils.regexp().mail.test(mail)){
    requester.menu.retrieve(mail).success(function () {
      rmLoading();
      toastr.success('您的密码已经发送到您的邮箱里，请注意查收');
      toLogin();
    }).error(function () {
      rmLoading();
      toastr.error('找回密码时，发生了错误请稍后在试');
    });
  }else{
    rmLoading();
    $('#retrieve_mail').addClass('redBorder');
  }
}

/*
 * 修改密码
 */
function changePw() {
  var newPw = $( '#change_pw' ).val();

  requester.menu.changepw(newPw).success(function () {
    goHome();
    $('#change_pw').val('');
    toastr.success('密码修改成功');
  }).error(function () {
    toastr.success('修改失败');
  });
}

/*
 * 退出登录
 */
function signOut() {
  requester.menu.signout().success(function () {
    toastr.success('您已经退出');
    $('#login_after').addClass('none');
    $('#login_before').removeClass('none');
  });
}



/*
 * 显示删除按钮
 * 鼠标滑过列表中的某一项，某项前面的删除按钮显示
 */
function historyMouseover() {
  $(this).find('.del_history').removeClass('none');
}

/*
 * 隐藏删除按钮
 * 鼠标滑出列表中的某一项，某项前面的删除按钮隐藏
 */
function historyMouseout() {
  $(this).find('.del_history').addClass('none');
}

/*
 * 鼠标滑过删除按钮，变颜色
 */
function deleteMouseover() {
  $(this).addClass('bgc');
}

/*
 * 鼠标滑出删除按钮，变颜色
 */
function deleteMouseout() {
  $(this).removeClass('bgc');
}

/*
 * 删除历史列表中的某一项
 */
function deleteClick() {
  NProgress.start();

  var id = $(this).parent().find('a').attr('_id');

  requester.menu.rmCode(id).success(function () {
    clearHistory();
    NProgress.done();
  }).error(function () {
    NProgress.done();
    toastr.error('删除失败');
  });
}

exports.load = load;                                    // 加载用户信息
exports.toggleMenu = toggleMenu;                        // 切换菜单状态
exports.appendChildDemos = appendChildDemos;            // 将demo插入到列表中
exports.getDemos = getDemos;                            // 获取历史demo列表
exports.rmRedBorder = rmRedBorder;                      // 清除输入框的红色边框

exports.toRegister = toRegister;                        // 切换到注册面板
exports.toLogin = toLogin;                              // 切换到登陆面板
exports.toRetrieve = toRetrieve;                        // 切换到找回密码面板
exports.toChangePw = toChangePw;                        // 显示修改密码面板
exports.goHome = goHome;                                // 返回到登陆主页面板

exports.login = login;                                  // 登陆
exports.register = register;                            // 注册
exports.retrieve = retrieve;                            // 找回密码
exports.changePw = changePw;                            // 修改密码
exports.signOut = signOut;                              // 登出

// history list
exports.historyMouseover = historyMouseover;            // 显示删除按钮
exports.historyMouseout = historyMouseout;              // 隐藏删除按钮
exports.deleteMouseover = deleteMouseover;              // 删除按钮变颜色
exports.deleteMouseout = deleteMouseout;                // 删除按钮变颜色 - 变回正常状态

exports.deleteClick = deleteClick;                      // 删除历史列表中的某一项
exports.clearHistory = clearHistory;                    // 清除缓存，并重新渲染列表
},{"../helper/requester.js":4,"../helper/utils.js":5}],7:[function(require,module,exports){
var controller = require( './controller' );

/*
 * 加载用户信息
 */
controller.load();

/*
 * 事件
 */
$('#btn_menu').click(controller.toggleMenu);        // 切换菜单
$('#mail').blur(controller.rmRedBorder);            // 清除输入框的红色边框
$('#password').blur(controller.rmRedBorder);        // 清除输入框的红色边框
$('#register_mail').blur(controller.rmRedBorder);   // 清除输入框的红色边框
$('#retrieve_mail').blur(controller.rmRedBorder);   // 清除输入框的红色边框
$('.register_link').click(controller.toRegister);   // 切换到注册面板
$('.login_link').click(controller.toLogin);         // 切换到登陆面板
$('.retrieve_link').click(controller.toRetrieve);   // 切换到找回密码面板
$('#change_link').click(controller.toChangePw);     // 显示修改密码面板
$('.backHome').click(controller.goHome);            // 返回到登陆主页面板
$('#btn_login').click(controller.login);            // 登陆
$('#btn_register').click(controller.register);      // 注册
$('#btn_retrieve').click(controller.retrieve);      // 找回密码
$('#btn_changePw').click(controller.changePw);      // 修改密码
$('#btn_signOut').click(controller.signOut);        // 修改密码
$('#history').on('mouseover', 'ul li', controller.historyMouseover);        // 显示删除按钮
$('#history').on('mouseout', 'ul li', controller.historyMouseout);          // 隐藏删除按钮
$('#history').on('mouseover', '.del_history', controller.deleteMouseover);  // 删除按钮变颜色
$('#history').on('mouseout', '.del_history', controller.deleteMouseout);    // 删除按钮变颜色 - 变回正常状态
$('#history').on('click', '.del_history', controller.deleteClick);          // 删除历史列表中的某一项

/*
 * 快捷键 - 切换菜单
 */
$(window).keydown(function (event) {
  if( event.keyCode === 77 && ( event.ctrlKey === true || event.metaKey === true ) ){
    controller.toggleMenu();
    return false;
  }
});

/*
 * 按enter登陆
 */
$('#password').keydown(function (event) {
  if( event.keyCode === 13 ){
    controller.login();
    return false;
  }
});

/*
 * Exports
 */
exports.getDemos = controller.getDemos;
exports.appendChildDemos = controller.appendChildDemos;
exports.clearHistory = controller.clearHistory;
},{"./controller":6}]},{},[3]);
