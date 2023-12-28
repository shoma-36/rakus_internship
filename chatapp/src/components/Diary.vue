<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import socketManager from "../socketManager.js";
import { postChatgpt } from '../api/index.js';
const chatList = reactive([]);

// #region local variable
const socket = socketManager.getInstance();

const chat_summary = async (chat_text) => {
    let prompt = [{ role: "system", content: "あなたは見出し作成条件に従ってチャットの見出しを作成するアシスタントです。チャットは「人の名前：メッセージ」で構成されています" }];
    const text = `=チャット=
  ${chat_text}
  ===
  *見出し作成条件*
  ・見出しは25文字以下
  ・メッセージに着目して記述
  ・あいさつは重要視しない
  ・チャットの概要が分かるように記述
  ***
  上記のチャットを見出し作成条件に従って一文で見出しを作成してください
  作成した見出し：`
    prompt.push({ role: "user", content: text })
    const answer = await postChatgpt(prompt)
    return answer;
};

onMounted(() => {
    // サーバーにリクエストを送信する
    requestSocketEvent();
    showSocketEvent();
});

const formatDate = (time) => {
    const options = { month: 'numeric', day: 'numeric' }
    return new Date(time).toLocaleDateString('ja-JP', options);
};

const onReceiveDB = (data) => {
    // JSON文字列をJavaScriptオブジェクトに変換
    const allData = JSON.parse(data);
    // チャットを日にちごとにグループ化
    const groupedChats = groupChatsByDate(allData);
    // グループ化されたデータをchatListに追加
    chatList.push(...groupedChats);
};

// 日にちごとにチャットをグループ化する関数
const groupChatsByDate = (chats) => {
    const groupedChats = {};
    chats.forEach((chat) => {
        const date = new Date(chat.time).toLocaleDateString();
        if (!groupedChats[date]) {
            groupedChats[date] = [];
        }
        groupedChats[date].push(chat);
    });
    return Object.values(groupedChats);
};

// 要約を実行する関数
let chatgroupSummaries = reactive({});

const summarizeChat = async (chats) => {
    const dateKey = formatDate(chats[0].time);
    chatgroupSummaries[dateKey] = "悩み中…"
    const chatText = chats.map(chat => chat.chat).join('\n');
    const summary = await chat_summary(chatText);
    chatgroupSummaries[dateKey] = summary.replace(/"/g, '');
    // chatgroupSummary.value = summary;
}


const requestSocketEvent = () => {
    // 日記ページに移動したら実行
    socket.emit("receiveEvent");
};

const showSocketEvent = () => {
    // 日記ページに移動したら実行
    socket.on("receivedata", (data) => {
        onReceiveDB(data);
    });
};

</script>

<template>
    <div class="container">
        <div class="component">
            <h1>Coffee Chat</h1>
            <div class="list">
                <router-link to="/chat" class="link">
                    <v-btn type="button" color="coffee" class="textContent">チャット</v-btn>
                </router-link>
                <div class="buttonPlaceholder textContent"></div>
            </div>
        </div>
        <div class="mainWrap">
            <div class="main" v-if="chatList.length !== 0">
                <h2>Diary</h2>
                <div>
                    <div class="mb-2" v-for="(chatgroup, i) in chatList.toReversed()" :key="i">
                        <div class="dateWrap">
                            <div class="dateHead">
                                <div class="dateBox">
                                    <span class="dateMonth">{{ formatDate(chatgroup[0].time).split('/')[0] }}</span>
                                    <span class="dateSlash">／</span>
                                    <span class="dateDay">{{ formatDate(chatgroup[0].time).split('/')[1] }}</span>
                                </div>
                                <div class="ma-2 titleWrap textContent">
                                    <h3 class="title">
                                        {{ chatgroupSummaries[formatDate(chatgroup[0].time)] }}
                                    </h3>
                                </div>
                            </div>
                            <v-btn type="button" color="coffee" class="textContent"
                                @click="summarizeChat(chatgroup)">日記をつくる</v-btn>
                        </div>
                        <ul class="chat textContent">
                            <li class="item ma-2 textContent chatContent" v-for="(chat, j) in chatgroup" :key="j">
                                {{ chat.chat }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.component {
    position: sticky;
    top: 0;
    background-color: rgb(var(--v-theme-milk));
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 15vh;
    padding: 0 30px;
    z-index: 9999;
}

.list {
    display: flex;
    align-items: center;
    gap: 8px;
}

.buttonPlaceholder {
    width: 4em;
}

.textContent {
    border-radius: 8px;
    padding: 4px 16px;
}

.mainWrap {
    display: flex;
    justify-content: center;
    background-color: rgb(var(--v-theme-coffee));
}

.main {
    background-color: rgb(var(--v-theme-milk));
    width: 100%;
    padding: 4px 16px;
}

@media (min-width: 1024px) {
    .main {
        width: 60%;
    }
}

.dateBox {
    flex-shrink: 0;
    position: relative;
    display: inline-block;
    width: 3em;
    height: 3em;
}

.dateMonth {
    position: absolute;
    text-align: center;
    vertical-align: top;
    top: 0;
    left: 0;
}

.dateSlash {
    font-size: 0;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 1px;
    border-left: 1px solid;
    transform: rotate(45deg);
}

.dateDay {
    position: absolute;
    text-align: center;
    vertical-align: bottom;
    bottom: 0;
    right: 0;
    margin: auto;
}

.dateWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
}

.dateHead {
    display: flex;
    flex-grow: 1;
    align-items: center;
    gap: 1em;
}

.titleWrap {
    width: 100%;
    background-color: rgb(var(--v-theme-cream));
    flex-grow: 1;
}

.title {
    display: inline-block;
    height: 1em;
    max-width: 60em;
}

.chat {
    background-color: rgb(var(--v-theme-chocolate));
    padding: 6px 0;
    max-height: 12em;
    overflow-y: auto;
    -ms-overflow-scroll: none;
    scrollbar-width: none;
}

.chat::-webkit-scrollbar {
    display: none;
}

.chatContent {
    background-color: rgb(var(--v-theme-milk));
}

.item {
    display: block;
}
</style>
