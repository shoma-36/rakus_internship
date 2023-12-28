'use strict';

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

function register() {
    // ユーザー名パスワードの取得
    const userName = $("#userName").val().trim();
    const passwd = $("#passwd").val().trim();

    // 入力確認
    const checkName = check(userName, "ユーザー名");
    const checkPass = check(passwd, "パスワード");

    if (checkName && checkPass) {
        const userInfo = {userName, passwd};
        socket.emit("submitUserInfoEvent", userInfo);
    }
}

// ユーザー登録ができたか表示
socket.on("returnUserInfoEvent", (message) => {
    alert(message);
});

