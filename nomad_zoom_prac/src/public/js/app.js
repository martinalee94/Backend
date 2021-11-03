const socket = io(); //front에 io 연결 socket id 가 자동으로 부여되어서 구분할 수 있음
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector('#mic');
const cameraBtn = document.querySelector('#cam');
const camerasSelect = document.querySelector('#cameras');
const call = document.querySelector("#call")

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        console.log(myStream);
        myFace.srcObject = myStream;
    } catch(e){
        console.log(e)
    }
}

getMedia();
function handleMuteStatus(event){
    event.preventDefault();
    if(muted){
        muteBtn.innerText = "마이크 끄기";
    }
    else{
        muteBtn.innerText = "마이크 켜기";
    }
    muted = !muted;
}

function handleCamStatus(event){
    event.preventDefault();
    if(cameraOff){
        cameraBtn.innerText = "카메라 끄기";
    }
    else{
        cameraBtn.innerText = '카메라 켜기';
    }
    cameraOff = !cameraOff;
}
muteBtn.addEventListener("click", handleMuteStatus);
cameraBtn.addEventListener('click', handleCamStatus);