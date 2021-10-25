const socket = io(); //front에 io 연결 socket id 가 자동으로 부여되어서 구분할 수 있음
const welcome = document.querySelector("#welcome");
const room = document.querySelector("#room");
const form = welcome.querySelector("form");

room.hidden=true;
let roomName;

function addMessage(message){
    const ul = room.querySelector('ul');
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value;
    socket.emit("new_msg", roomName, input.value, ()=>{  //서버로 메세지보냄
        addMessage(`You: ${value}`);
    });
    input.value="";
}
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    //console.log("server is done!"); //프론트에서 실행한다
    const form = room.querySelector('form');
    form.addEventListener('submit', handleMessageSubmit);
};

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    //room 이라는 이벤트로 객체,숫자,스트링 등 전부 전송가능, last arg는 서버가 콜백해줄함수(신기하다)
    roomName = input.value;
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);

socket.on('welcome', ()=>{
    addMessage("Someone joined");
});

socket.on('bye',()=>{
    addMessage("Someone left")
});

socket.on("new_msg", addMessage);















/*
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nickname');
const messageForm = document.querySelector('#message');

const socket = new WebSocket(`ws://${window.location.host}`);
function makeMsg(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
};

socket.addEventListener('open', ()=>{
    console.log('Connected to server ✔️');
});
socket.addEventListener('message', (message)=>{
    console.log('New message(server) : ', message.data,);
    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener('close',()=>{
    console.log('Disconnected from server ❌');
});

// setTimeout(()=>{
//     socket.send('hello from the browser!')
// },10000)

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector('input');
    socket.send(makeMsg("new_message", input.value));
    const li = document.createElement('li');
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value="";
}

messageForm.addEventListener('submit', handleSubmit);

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector('input');
    socket.send(makeMsg('nickname', input.value));

}
nickForm.addEventListener('submit', handleNickSubmit);

 */