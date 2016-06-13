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