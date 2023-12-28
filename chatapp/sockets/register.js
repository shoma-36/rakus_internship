"use strict";
const fs = require("fs");

module.exports = function (socket, member_path) {
    // receive user infomation
    socket.on("submitUserInfoEvent", (data) => {
        // Jsonファイルの読み込み
        const db = JSON.parse(fs.readFileSync( __dirname + member_path, 'utf8'));
        // クライアントへの送信メッセージ
        let message;
        // ユーザー名に重複がないとき、成功
        if (!db[data.userName]) {
            db[data.userName] = data;
            // Jsonファイルに新しいユーザー情報を書き込み
            fs.writeFileSync(__dirname + member_path, JSON.stringify(db, null, 2));
            console.log("Add user:" + data.userName);
            message = "登録が完了しました";
        } 
        // ユーザー名重複のとき、処理をせずにメッセージのみ渡す
        else {
            message = ("ユーザー名「" + data.userName + "」はすでに存在します。");
        }
        
        socket.emit("returnUserInfoEvent", message);
    });
};