## 機能

### 基本要件

#### ログイン画面
<img width="726" alt="image" src="https://github.com/shoma-36/rakus_internship/assets/131255118/3651c84b-300a-4ff1-a1e8-d7afa64d6ace">

- 入室時のメッセージの作成
- ユーザ名が未入力で「入室する」が押されたらエラーダイアログを表示する

#### チャット画面

<img width="960" alt="image" src="https://github.com/shoma-36/rakus_internship/assets/131255118/e56d50c2-7c0f-4c26-9370-dd05275d3cab">

- どこのページから戻ってきても保持されている

- ログイン画面で入力されたユーザ名に「さん」を加えて表示する
  - 入力：山田太郎
  - 表示：ログインユーザ：山田太郎さん
- 「投稿」ボタンでメッセージを投稿する
  - 投稿されたメッセージは自分を含め、すべてのクライアントに投稿者名とともに表示される
  - 例） ○○○○ さん：（投稿文）
- 「投稿」ボタンでメモを投稿する
  - Enterを押しても投稿が可能
  - 投稿されたメモは自分にだけ表示される
  - 例） ○○○○ さんのメモ：（投稿文）
- 投稿は新しい順に表示される
- ユーザの入退室時に自分を除いた他のクライアントに入退室のメッセージが表示される
  - 入室の例） ○○○○ さんが入室しました
  - 退室の例） ○○○○ さんが退室しました
 
## 日記画面
![image](https://github.com/shoma-36/rakus_internship/assets/131255118/28f59b2e-94f5-446c-9fd3-38ea49e28c85)

- 日記画面を開くと日ごとのチャットの内容が表示される
- 「日記をつくる」ボタンを押すと、日ごとのチャット内容をまとめた日記が表示される
  
<img width="491" alt="image" src="https://github.com/shoma-36/rakus_internship/assets/131255118/a923e0fc-3f34-4efc-b29f-ea1f0d2a3c3e">

- 日記はChatGPTによって生成される
- 日記作成条件
  - メッセージに着目して作成
  - あいさつを重要視しない
  - チャットの概要が分かるように記述

# 使用技術
Vue.js,sqlite,ChatGPT4
