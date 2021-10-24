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