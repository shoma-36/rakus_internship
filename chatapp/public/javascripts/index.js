"use strict";

function check(str, key) {
    if (str === "") {
        alert(key + "を入力して下さいませ.ご主人様");
        return false
    } else if (str === null) {
        alert(key + "がnullですわ");
        return false
    }
    return true
}

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $("#userName").val().trim();
    const passwd = $("#passwd").val().trim();

    // ユーザ名が未入力でないかチェックする
    const checkName = check(userName, "ユーザー名");
    const checkPass = check(passwd, "パスワード");

    if (checkName && checkPass) {
        const userInfo = {userName, passwd};
        socket.emit("loginUserEvent", userInfo);
    }

    socket.on("returnLoginEvent", (success) => {
        if (success){
            $("form").submit();
        }
        else {
            alert("ユーザー名もしくはパスワードが異なります");
        }
    });
}
