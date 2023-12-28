import PostTable, { DBCommon } from "../sqlite3.js";
import { format } from "date-fns";

export default (io, socket) => {
    // 入室メッセージをクライアントに送信する
    socket.on("enterEvent", (data) => {
        socket.broadcast.emit("enterEvent", data);
    });

    // 退室メッセージをクライアントに送信する
    socket.on("exitEvent", (data) => {
        socket.broadcast.emit("exitEvent", data);
    });

    // 投稿メッセージを送信する
    socket.on("publishEvent", async (data) => {
        await DBCommon.init();
        await PostTable.createTableIfNotExists();
        await PostTable.insert(data);
        io.sockets.emit("publishEvent", data);
    });

    // 投稿メッセージを受信する
    socket.on("receiveEvent", async () => {
        await DBCommon.init();
        const data = await PostTable.selectAll();
        io.sockets.emit("receivedata", data);
    });

    socket.on("requestTodayChat", async () => {
        const today = format(new Date(), "yyyy-MM-dd");
        await DBCommon.init();
        const data = await PostTable.select([`time like '${today}%'`]);
        io.sockets.emit("receiveTodayChat", data);
    });
};
