'use strict';
var codeDB = require( '../db/codeDB' );
var ObjectID = require( '../db/mongo' ).ObjectID;
var request = require( 'request' );

exports.createCode = function (data, callback) {
    if( data.id && data.codeText && data.type ){
        var time = new Date().getTime();
        codeDB.getCodeById( data.id, function( err, result ){
            if( !err && !result ){

                // 创建代码
                codeDB.insertCode( { _id : data.id, codeText : data.codeText, type : data.type, userID : data.userID, firstTime : time, lastTime : time }, function( err, result ){
                    callback( err, result[0], 0 );
                } );

                requestStat(data.type, data.userID);
            }
            if( result && result.userID === data.userID ){

                // 修改代码
                codeDB.updateCode( data.id, { codeText : data.codeText, lastTime : time }, function( err, result ){
                    callback( err, result, 1 );
                } );
            }
            if( result && result.userID !== data.userID ){

                // 创建新代码
                codeDB.insertCode( { _id : ObjectID().toString(), codeText : data.codeText, type : data.type, userID : data.userID, firstTime : time, lastTime : time }, function( err, result ){
                    callback( err, result[0], 2 );
                } );

                requestStat(data.type, data.userID);
            }
        } );
    }

    function requestStat (type, userID) {
        // 统计
        var options = {
            url: 'http://stat.berwin.me/api/v1/content',
            json: true,
            method: 'POST',
            timeout: 30000,
            body: {
                groupID : '558a3f4d2edd55e35e096fb2',
                sourceID : '558a2ef3459c3d595db03329',
                token: '558a2ef3459c3d595db03328'
                data : {
                    user: userID,
                    value: type
                }
            }
        };

        request(options, function (e, r, body) {});
    }
};

exports.getCodeById = function (id, callback) {
    codeDB.getCodeById( id, callback );
};

exports.getDemosByUserID = function (userID, callback) {
    codeDB.getDemosByUserID( userID, callback );
};

exports.rmCodeById = function (id, callback) {
    id && codeDB.rmCodeById(id, callback);
};