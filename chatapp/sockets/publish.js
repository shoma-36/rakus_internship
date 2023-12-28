'use strict';
const fs = require("fs");

module.exports = function (socket, io, db_paths) {
    // 投稿メッセージを送信する
    let room;
    let db_path;
    let db;
    socket.on('publishEvent', function (userName, message) {

        if (!message) {
            return;
        }

        var now = new Date();
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var day = ("0" + now.getDate()).slice(-2);
        var hour = ("0" + now.getHours()).slice(-2);
        var minute = ("0" + now.getMinutes()).slice(-2);
        var second = ("0" + now.getSeconds()).slice(-2);
        var postdate = month + "/" + day + " " + hour + ":" + minute;
        var int_date = 0;
        int_date =
            month * 31 * 24 * 3600 +
            day * 24 * 3600 +
            hour * 3600 +
            minute * 60 +
            second; //秒単位でソート出来るように
        console.log('投稿日時' + postdate);
        console.log('投稿内容：' + message);

        // 全クライアントが受信するメッセージ表示イベント（receiveMessageEvent）を送信する
        if(!room) {
            // バグの原因になるのでホームでは投稿しても何も起こらないようにしました
            console.log('no room');
        } else {
            io.to(room).emit('receivePublishEvent', userName, message, postdate);
            console.log('room=' + room);

            // Jsonデータベースに投稿を記録(ルームごとに保存場所を分ける)
            // let chatlog = { userName, message, postdate };
            // db_path = db_paths[room];
            // db = JSON.parse(fs.readFileSync( __dirname + db_path, 'utf8'));
            // let lognum = Object.keys(db).length;
            // db[lognum] = chatlog;
            // fs.writeFileSync(__dirname + db_path, JSON.stringify(db, null, 2));
            mongoinsert(userName, message, postdate, int_date,room);
            mongodelete(room);
        }
    });

    socket.on('chooseRoom', function(data) {
        if(!data) {
            return;
        }
        // チャットルームの変更
        room = data;
        socket.join(room);
        console.log('joined: ' + room);

        // チャットルームの過去の投稿を送信
        // db_path = db_paths[room]
        // db = JSON.parse(fs.readFileSync( __dirname + db_path, 'utf8'));
        //socket.emit("sendPastMessageRoom", db);
        mongo_sendPastMessages(socket,room);
    });

    socket.on('exitfromRoom', function() {
        console.log('exit from ' + room);
        room = '';
    });
};

function mongoinsert(userName, message, postdate, int_date,roomid) {
    const uri =
        "mongodb+srv://kurodadaiki:kurodadaiki@cluster0.tpka35w.mongodb.net/?retryWrites=true&w=majority";
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
        //接続開始！

        const collection = client.db("rakus").collection("Comments"); //使うテーブル決めるよぉ

        let insertresult = new Promise(function (resolve) {
            //同期処理するよ
            collection.insertOne(
                //insertするよー
                {
                    name: userName,
                    message: message,
                    int_date: int_date,
                    date: postdate,
                    roomid: roomid
                },
                (error, result) => {
                    console.log("error:" + error);
                    console.log("result:" + result);
                }
            );
            resolve();
        });

        insertresult.then(function () {
            client.close(); //コネクション斬るアルね
        });
    });
}

function mongo_sendPastMessages(socket,roomid) {
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
            socket.emit("sendPastMessageRoom", documents);
            client.close();
        });
    });
}

function mongodelete(roomid) {
    const uri =
        "mongodb+srv://kurodadaiki:kurodadaiki@cluster0.tpka35w.mongodb.net/?retryWrites=true&w=majority";
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
        //接続開始！

        const collection = client.db("rakus").collection("Comments"); //使うテーブル決めるよぉ

        let findresult = new Promise(function (resolve) {
            //同期処理するよ
            collection.find({roomid:roomid}).toArray(function (error, documents) {
                
                //最古のメッセージの日時をあぶり出します.
                let num = 0;
                let minint_date = 9999999999;
                let mininame="";
                for (let document of documents) {
                    num++;
                    if (document.int_date < minint_date) {
                        minint_date = document.int_date; //一番昔のデータを入れる
                        mininame=document.name;
                    }
                }

                //10個以上だったら古いものを消す
                if (10 < num) { //今は10個のメッセージだけDBに保存します。
                    collection.deleteOne(
                        { int_date: minint_date ,name:mininame},
                        (error, result) => {
                            console.log("delete,error:" + error);
                            console.log(result);
                        }
                    );
                }
            });
            resolve();
        });

        findresult.then(function () {
            client.close();
        });
    });
}