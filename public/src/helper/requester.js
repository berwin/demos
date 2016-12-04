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