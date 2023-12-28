'use strict';

module.exports = function (server) {

    const socketIo = require('socket.io')(server, { wsEngine: 'ws' });
    const io = socketIo.listen(server);

    const db_paths = {
        "room01": "/db/database_room01.json",
        "room02": "/db/database_room02.json",
        "room03": "/db/database_room03.json",
        "room04": "/db/database_room04.json",
        "room05": "/db/database_room05.json",
    };
    const member_path = "/db/member.json";

    io.sockets.on('connection', function (socket) {
        // 投稿モジュールの呼出
        require('./publish')(socket, io, db_paths);

        // 入室モジュールの呼出
        require('./enter')(socket, member_path);

        // 退室モジュールの呼出
        require('./exit')(socket);

        // 新規登録モジュールの呼出
        require('./register')(socket, member_path);

        // ログインモジュールの呼出
        require('./login')(socket, member_path);
    });
};
