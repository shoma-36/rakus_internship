"use strict";
// 入室メッセージをサーバに送信する

const userName = document.getElementById("userName").value;// 入力されたユーザ名を取得する
socket.emit("enterMy", userName);
// 入室メッセージイベントを送信する

// メンバーリストを受け取る
socket.on("sendMemberList", (memberList) => {
    for ( let i = 0; i < memberList.length; i++ ){
        $(".memberList").append("<p>" + memberList[i] + "</p>");
    }
});

// サーバから受信した入室メッセージを画面上に表示する
socket.on("enterMyselfEvent", function (documents) {
    showDocuments(documents);
    $("#thread").prepend("<p>あなたが入室しました</p>");
});
socket.on("enterOtherEvent", function (data) {
    $("#thread").prepend("<p>" + data + "さんが入室しました</p>");
});

function showDocuments(db){
    let keys = Object.keys(db);
    for ( let i = 0; i < keys.length; i++ ){
        let chatUserName = db[keys[i]].name;
        let chatMessage = db[keys[i]].message;
        let chatdate = db[keys[i]].date;
        let chat_int_date = db[keys[i]].int_date;
        
        let blankNum = chatUserName.length;
        let nameBlank = "";

        if (chatUserName.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/)) {
            //userNameが全角文字の時
            for (let i = 0; i < blankNum; i++) {
                nameBlank += "  ";
            }
        } else {
            //全角文字以外
            for (let i = 0; i < blankNum; i++) {
                nameBlank += " ";
            }
        }

        let receiveMessage = chatMessage.split("\n").join("<br>             " + nameBlank);
        console.log(blankNum);
        console.log(receiveMessage);

        $('#thread').prepend('<p>' + receiveMessage + '</p>');
        $('#thread').prepend('<p><span class="chat-user">' + chatUserName + 'さん　</span><span class="chat-date">' + chatdate + '</span></p>');

    }
}