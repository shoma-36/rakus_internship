'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名取得
    const userName = document.getElementById("userName").value;
    // 退室メッセージイベントを送信する
    socket.emit("sendExitEvent", userName);
    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on("receiveExitEvent", function (data) {
    $('#thread').prepend('<p>' + data + '</p>');
});