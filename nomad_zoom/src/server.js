import express from "express";
import http from 'http';
import path from 'path';
import {WebSocketServer} from 'ws';
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

//http ws를 같은 서버에서 작동시킴 on the same port , but this is not necessary
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); //http서버 위에 ws서버를 만든것 http://localhost/:3000 & ws://localhost/:3000
server.listen(3000, handleListen);

const sockets = [];
function readMsg(){
    JSON.parse
}
wss.on('connection', (socket)=>{
//    console.log(socket);
    sockets.push(socket);
    socket["nickname"] ="Anon";
    console.log('Connected to Browser!');
    socket.on('message', (msg)=>{
        //if(message.type === "nickname")
        const message = JSON.parse(msg);
        switch(message.type){
            case 'new_message':
                sockets.forEach((aSocket)=>{
                    aSocket.send(`${socket.nickname}:${message.payload}`);
                });
            case 'nickname':
                socket["nickname"] = message.payload;
         }
        // if(parsed.type ==="new_message"){ //메세지로 되어있는 애만 출력
        //     sockets.forEach((aSocket)=>{
        //         aSocket.send(parsed.payload);
        //     })
        // } else if(parsed.type ==="nickname"){
            
        // }
    });
    socket.on('close', () =>{
        console.log('Disconnected from the browser');
    });
})

