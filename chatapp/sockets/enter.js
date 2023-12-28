"use strict";
const fs = require("fs");

function getMemberList(member_path) {
    const memdb = JSON.parse(fs.readFileSync( __dirname + member_path, 'utf8'));
    return Object.keys(memdb);
}

module.exports = function (socket, member_path, db_path) {
    // 入室メッセージをクライアントに送信する & 入出時にメンバーリストを送信
    socket.on("enterMy", (data) => {
        // メンバーリストの取得
        let memberList = getMemberList(member_path);
        socket.emit("sendMemberList", memberList);

        // 自分への入室メッセージ
        //socket.emit("enterMyselfEvent", data);
        mongo_sendPastMessages_enter(socket,"room00");
        // 他のユーザーへの入室メッセージ
        socket.broadcast.emit("enterOtherEvent", data);
    });
};

function mongo_sendPastMessages_enter(socket,roomid) {
    const uri =
        "mongodb+srv://kurodadaiki:kurodadaiki@cluster0.tpka35w.mongodb.net/?retryWrites=true&w=majority";
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
        //接続開始！

        const collection = client.db("rakus").collection("Comments"); //使うテーブル決めるよぉ

        let findresult = new Promise(function (resolve) {
            //同期処理するよ
            collection.find({roomid:roomid}).toArray(function (error, documents) {
                resolve(documents);
            });
        });
        findresult.then(function (documents) {
            socket.emit("enterMyselfEvent", documents);
            client.close();
        });
    });
}