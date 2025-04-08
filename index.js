const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
const onlineUsers = {};
const chatHistory = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.emit('chat-history', chatHistory);

    socket.on('user-connected', name => {
        onlineUsers[socket.id] = name; //Lưu người dùng vào onlineUsers
        console.log(`${name} đã online`);
        io.emit('update-user-list', Object.values(onlineUsers)); //Gửi list user online cho mọi client
    });

    socket.on('disconnect', () => {
        console.log(`${onlineUsers[socket.id]} đã ngắt kết nối`);
        delete onlineUsers[socket.id]; //Xóa người dùng khỏi danh sách onlineUsers
        io.emit('update-user-list', Object.values(onlineUsers));
    })

    socket.on('on-chat', data => {
        chatHistory.push(data); //Lưu lịch sử chat
        io.emit('user-chat', data);
    })
});

server.listen(3000, () => {
    console.log("listening on port:3000");
})