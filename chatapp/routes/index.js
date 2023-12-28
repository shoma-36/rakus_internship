'use strict';

const express = require('express');
const router = express.Router();

// ログイン画面の表示
router.get('/', function(request, response, next) {
    response.render('index');
});

// チャット画面の表示
router.post('/room', function(request, response, next) {
    console.log('ユーザ名：' + request.body.userName);//request.body.userNameログイン画面の.bodyの.userName(Id)に入っているものを参照できるみたいです。
    response.render('room', { userName: request.body.userName });//userNameをroom画面に送信しています
});

// 新規登録画面の表示
router.get('/register', function(request, response, next) {
    response.render('register');
});


module.exports = router;
