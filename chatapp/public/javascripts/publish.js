'use strict';

//No.5 エンターキーで投稿
let text_form = document.getElementById('message');
text_form.addEventListener('keypress', test_ivent);

function test_ivent(e) {
  	if (e.keyCode === 13 && e.shiftKey === true) {
        text_form += "\n";
	} else if (e.keyCode === 13) {
        publish();
    }
}

function getMessage() {
    const message = document.getElementById("message");
    if (!message.value.trim() || message.value.trim() === null) {
        alert("メッセージを入力してください!");
        message.value = '';
        message.blur();
    }
    return message;
}

// 投稿メッセージをサーバに送信する
function publish() {
    
    // ユーザ名を取得
    const userName = $('#userName').val();
    // メッセージ取得
    const message = getMessage();
    // 投稿内容を送信
    socket.emit('publishEvent', userName, message.value);
    message.value = '';
    message.blur();
    return false;
}

// 個別のルームのボタンが押されたら，ルームに入る
function selectRoom(id) {
    var room = $(id).val();
    // 一旦スレッドをクリーンな状態にする
    $('#thread').empty();
    socket.emit('chooseRoom', room);
    console.log('room: ' + room);

    //タイトルの書き換え
    let nowRoom = $('[name=chooseRoom]:checked').val();
    // console.log(nowRoom);
    if(nowRoom === "room00") {
        document.querySelector("h4").innerText = "ホーム";
    } else if(nowRoom === "room01") {
        document.querySelector("h4").innerText = "監督ルーム";
    } else if(nowRoom === "room02") {
        document.querySelector("h4").innerText = "部員ルーム";
    } else if(nowRoom === "room03") {
        document.querySelector("h4").innerText = "Aチーム";
    } else if(nowRoom === "room04") {
        document.querySelector("h4").innerText = "Bチーム";
    } else if(nowRoom === "room05") {
        document.querySelector("h4").innerText = "雑談ルーム";
    }
}

// 「ホーム」ボタンが押されたら，個別のルームから退出する
function exitRoom() {
    // 一旦スレッドをクリーンな状態にする
    $('#thread').empty();
    socket.emit('exitfromRoom');
    console.log('exit room');
}

// 過去の投稿を受け取る
socket.on("sendPastMessageRoom", (db) => {
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
})

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('receivePublishEvent', function (userName, message, date) {
    let receiveMessage = message;
    let blankNum = userName.length;
    let nameBlank = "";
    
    if (userName.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/)) {
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
    receiveMessage = receiveMessage.split("\n").join("<br>             " + nameBlank);
    console.log(blankNum);
    console.log(receiveMessage);

    $('#thread').prepend('<p>' + receiveMessage + '</p>');
    $('#thread').prepend('<p>' + userName + 'さん　' + date + '</p>');
});