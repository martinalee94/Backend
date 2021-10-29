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

function publicRooms(){
    const {
        sockets:{
            adapter:{sids, rooms}, //adapter로부터 sids와 rooms를 가져온다
        },
    } = wsServer;
    //const sids = wsServer.sockets.adapter.sids;
    //const rooms = wsServer.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_, key)=>{
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}
wsServer.on("connection", (socket) =>{
    socket['nickname'] = 'anonymous'
    socket.onAny((event)=>{
        console.log('socket on event')
    });
    socket.on("enter_room", (roomName, done) =>{
        socket.join(roomName); //방에 참가한다!
        done();
        socket.to(roomName).emit("welcome",socket.nickname,countRoom(roomName)); //방에 참가한 사람들에게 모두 보냄
        // setTimeout(()=>{
        //     done(); //front에서 보낸 함수를 콜함, 백엔드에서 initiated 그리고 프론트에서 실행
        // },[2000])
        wsServer.sockets.emit("room_change", publicRooms()); //서버의 모든 소켓에 메세지를 보냄

    });
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach((room)=>{
            socket.to(room).emit("bye",socket.nickname, countRoom(room)-1) //내가 이방을 떠나기 직전이기 때문에 나를 없애려면 -1해줘야함
        });
    });
    socket.on("disconnect", ()=>{
        wsServer.sockets.emit("room_change", publicRooms()); //서버의 모든 소켓에 메세지를 보냄
    });
    socket.on("new_msg",(room, msg, done)=>{
        socket.to(room).emit("new_msg", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on('nickname', (nickname) =>{
        socket["nickname"] = nickname;
    })

});


/*---------------------------------------------------------------------------------
//http ws를 같은 서버에서 작동시킴 on the same port , but this is not necessary
const wss = new WebSocketServer({ httpserver }); //http서버 위에 ws서버를 만든것 http://localhost/:3000 & ws://localhost/:3000
const sockets = [];

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

 */