"use strict";
const fs = require("fs");

module.exports = function (socket, member_path) {
    // receive user infomation
    socket.on("loginUserEvent", (data) => {
        // Jsonファイルの読み込み
        const db = JSON.parse(fs.readFileSync( __dirname + member_path, 'utf8'));
        // クライアント認証の可否
        let success;
        // ユーザーが存在し，パスワードが一致するとき
        if (db[data.userName] && db[data.userName]["passwd"] === data.passwd){
            success = true;
        }
        else {
            success = false;
        }

        socket.emit("returnLoginEvent", success);
    });
};