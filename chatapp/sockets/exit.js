'use strict';

module.exports = function (socket) {
    // 退室メッセージをクライアントに送信する
    socket.on("sendExitEvent", function (name) {

        // Send an exit message to other clients
        let message = name + "さんが退出しました";
        socket.broadcast.emit("receiveExitEvent", message);
    });
};
