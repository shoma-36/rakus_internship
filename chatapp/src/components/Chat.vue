<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import socketManager from "../socketManager.js";
import { useRouter } from "vue-router";

// #region global state
const userName = inject("userName");
// #endregion

// #region local variable
const socket = socketManager.getInstance();
const router = useRouter();
// #endregion

// #region reactive variable
const chatContent = ref("");
const chatList = reactive([]);
// #endregion

// #region lifecycle
onMounted(() => {
    registerSocketEvent();
    fetchData();
});
// #endregion

const fetchData = () => {
    socket.emit("requestTodayChat");
};

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
    if (!chatContent.value) {
        return alert("メッセージを入力してください。");
    }
    socket.emit("publishEvent", `${userName.value}さん:${chatContent.value}`);
    chatContent.value = "";
};

// 退室メッセージをサーバに送信する
const onExit = () => {
    socket.emit("exitEvent", `${userName.value}さんが退室しました。`);
    router.push({ name: "login" });
};
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
    chatList.push(data);
};

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
    chatList.push(data);
};

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
    chatList.push(data);
};
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
    // 入室イベントを受け取ったら実行
    socket.on("enterEvent", (data) => {
        onReceiveEnter(data);
    });

    // 退室イベントを受け取ったら実行
    socket.on("exitEvent", (data) => {
        onReceiveExit(data);
    });

    // 投稿イベントを受け取ったら実行
    socket.on("publishEvent", (data) => {
        onReceivePublish(data);
    });

    socket.on("receiveTodayChat", (data) => {
        JSON.parse(data).forEach(({ chat }) => chatList.push(chat));
    });
};
// #endregion
// enables v-focus in templates
const vFocus = {
    mounted: (el) => el.focus(),
};
</script>

<template>
    <div class="container">
        <div class="component">
            <h1>Coffee Chat</h1>
            <div class="list">
                ログインユーザ：{{ userName }}さん
                <router-link to="/diary">
                    <v-btn type="button" color="coffee" class="textContent">
                        日記
                    </v-btn>
                </router-link>
                <v-btn
                    type="button"
                    @click="onExit"
                    color="coffee"
                    class="textContent"
                >
                    退室
                </v-btn>
            </div>
        </div>
        <v-virtual-scroll
            width="100%"
            height="70%"
            :items="chatList"
            class="chat"
        >
            <template
                v-if="chatList.length !== 0"
                v-slot:default="{ item: chat }"
            >
                <v-list-item :key="chat" class="chatItem">
                    <v-list-item-content>
                        <v-list-item-title class="chatContent textContent">
                            {{ chat }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-virtual-scroll>
        <div class="component list">
            <input
                type="text"
                placeholder="投稿文を入力してください"
                v-model="chatContent"
                v-focus
                @keydown.enter="onPublish"
                @keydown.esc="onExit"
                class="textContent input"
                maxlength="70"
            />
            <v-btn @click="onPublish" color="coffee" class="textContent">
                投稿
            </v-btn>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: 100vh;
}
.component {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 15%;
    padding: 0 30px;
}
.list {
    display: flex;
    align-items: center;
    gap: 8px;
}
.chat {
    background-color: rgb(var(--v-theme-chocolate));
    padding: 6px 0;
}
.chatItem {
    padding: 6px 24px;
}
.chatContent {
    background-color: rgb(var(--v-theme-milk));
}
.textContent {
    border-radius: 8px;
    padding: 4px 16px;
}
.input {
    width: 100%;
    outline: rgb(var(--v-theme-coffee)) solid 2px;
}
</style>
