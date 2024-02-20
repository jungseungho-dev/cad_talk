const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const path = require("path");

const app = express();
const home = path.join(__dirname, 'index.html');

app.use(express.static(__dirname))

app.get('/', (_,res) => res.sendFile(home))

const handleListen = () => console.log(`ws://localhost:3000`)

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
httpServer.listen(3000, handleListen)

wsServer.on("connection", socket => {

    socket.on('nickName', (data, done)=>{
        socket.join('room');
        let name = data.payload;
        socket['nickName'] = name;
        done(name)
        socket.to('room').emit('enter', {'payload' : name})
        wsServer.to('room').emit('count', countRoom());
    })
    socket.on('msg', (data)=>{
        socket.to('room').emit('msg',{'payload': data.payload, 'nickName' : socket.nickName})
    })
    socket.on('disconnect', ()=>{
        socket.to('room').emit('bye', {'nickName':socket.nickName, 'number' : countRoom()})
    })
    // 오목게임
})
function countRoom(){
    try{
        const roomSize = wsServer.sockets.adapter.rooms.get('room').size ;
        return roomSize !== undefined ? roomSize : 0;
    } catch (error){
        console.log("Error:", error.message);
        return 0;
    }
}