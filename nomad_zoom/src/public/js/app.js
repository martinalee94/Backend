const socket = io(); //front에 io 연결 socket id 가 자동으로 부여되어서 구분할 수 있음
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector('#mute');
const cameraBtn = document.querySelector('#camera');

let myStream;
let muted = false;  //mute와 카메라 상태를 체크하는 변수
let cameraOff = false;

async function getMedia(){
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            {
                audio:true,
                video:true,
            }
        );
        myFace.srcObject = myStream;
    } catch(e){
        console.log(e);
    }
}
getMedia();
function handleMuteClick(){
    if(!muted){ //mute로 바뀜
        muteBtn.innerText = "Unmute";
        muted = true;
    } else{ //unmute로 바뀜
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraClick(){
    if(cameraOff){ //카메라가 꺼져있을때 클릭하면 카메라가 켜짐
        cameraBtn.innerText = 'Turn Camera Off';
        cameraOff = false;
    } else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);