<script setup>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import socketManager from "../socketManager.js";

// #region global state
const userName = inject("userName");
// #endregion

// #region local variable
const router = useRouter();
const socket = socketManager.getInstance();
// #endregion

// #region reactive variable
const inputUserName = ref("");
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
    const trimmedUserName = inputUserName.value.trim();
    // ユーザー名が入力されているかチェック
    if (!trimmedUserName) {
        return alert("ユーザー名を入力してください");
    }
    // 入室メッセージを送信
    socket.emit("enterEvent", `${trimmedUserName}さんが入室しました。`);

    // 全体で使用するnameに入力されたユーザー名を格納
    userName.value = trimmedUserName;

    // チャット画面へ遷移
    router.push({ name: "chat" });
};
// #endregion

// enables v-focus in templates
const vFocus = {
    mounted: (el) => el.focus(),
};
</script>
<template>
    <div class="background-container">
        <div class="content-container">
            <div class="flex-container">
                <div class="image-container">
                    <img
                        src="../images/logo.png"
                        alt="Logo"
                        style="width: 100px; height: auto"
                    />
                </div>
                <div class="form-container">
                    <form>
                        <div class="mt-10">
                            <p>ユーザー名</p>
                            <input
                                id="userName"
                                type="text"
                                class="user-name-text"
                                v-model="inputUserName"
                                v-focus
                            />
                        </div>
                        <button @click="onEnter()" class="button-normal">
                            入室する
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.background-container {
    background: url("../images/bacground.jpg") no-repeat center center fixed;
    background-size: cover;
    height: 100vh;
    display: flex;
    align-items: center;
}

.content-container {
    width: 80%;
    margin: 0 auto;
}

.flex-container {
    display: flex;
    margin-left: 20px;
    background-color: #dac3a3;
    padding: 20px;
    border-radius: 10px;
    height: 300px;
}

.image-container {
    flex: 1;
    margin-left: 20%;
    margin-top: 10%;
}

.form-container {
    flex: 1;
    margin-right: 30%;
    margin-top: 5%;
}

.user-name-text {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    border: 1px solid #888;
    margin-bottom: 16px;
}
</style>
