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