import express from "express";
import http from 'http';
import path from 'path';
import {WebSocketServer} from 'ws';
import {Server} from 'socket.io'
const __dirname = path.resolve();

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');
app.use('/public', express.static(__dirname +"/src/public"));
app.get('/', (req, res)=>{res.render('home')});
app.get('/*', (_, res)=>res.redirect('/'));

const handleListen = () => {
    console.log('The server is started running on the port 3000')
}
//app.listen(3000);

const httpserver = http.createServer(app);
const wsServer = new Server(httpserver);
httpserver.listen(3000, handleListen);

wsServer.on("connection", socket=>{
    socket.on("join_room",(roomName) =>{
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    })
    socket.on("offer", (offer, roomName)=>{
        socket.to(roomName).emit('offer',offer);
    });
    socket.on("answer", (answer, roomName)=>{
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName)=>{
        socket.to(roomName).emit("ice", ice);
    });
})