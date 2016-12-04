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