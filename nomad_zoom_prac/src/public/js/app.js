const socket = io(); //front에 io 연결 socket id 가 자동으로 부여되어서 구분할 수 있음
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector('#mic');
const cameraBtn = document.querySelector('#cam');
const camerasSelect = document.querySelector('#cameras');
const call = document.querySelector("#call")
const welcome = document.querySelector("#welcome")


call.hidden = true;
let myStream;
let myPeerConnection;
let muted = false;
let cameraOff = false;


async function getMedia(deviceId){
    const initialConstraints ={ //맨처음 getmedia불렸을때, 카메라 설정이 아무것도 없을때
        audio : true,
        video:{ facingMode : 'user'},
    }
    const cameraConstraints={
        audio:true,
        video:{deviceId: {exact:deviceId}},  //specific camera
    }
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstraints //deviceid가 존재하지 않는 처음 호출에서는 initial값을 준다
        );
        //console.log(myStream);
        myFace.srcObject = myStream;
        if(!deviceId){ //맨처음 deviceid가 없는 상황에서만 카메라 목록을 가져온다
            await getCameras();
        }
    } catch(e){
        console.log(e)
    }
}

//getMedia();

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput')
        const currentCamera = myStream.getVideoTracks()[0]; 
        cameras.forEach((camera)=>{
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label){
                option.selected = true;  //내가 현재 사용하고 있는 camera를 셀렉트 옵션에서 보여주도록 설정
            }
            camerasSelect.appendChild(option);
        })
        console.log("devices", devices)
    } catch(e){
        console.log(e)
    }
}

function handleMuteStatus(event){
    event.preventDefault();
    myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled );
    const micImg = muteBtn.querySelector('img');
    if(muted){ 
        micImg.setAttribute("src", "/public/assets/unmute.png");
    }
    else{ 
        micImg.setAttribute("src", "/public/assets/mute.png");
    }
    muted = !muted;    
}

function handleCamStatus(event){
    event.preventDefault();
    console.log(myStream.getVideoTracks())
    myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled )
    const camImg = cameraBtn.querySelector('img');
    if(cameraOff){ 
        camImg.setAttribute("src", "/public/assets/camon.png");
    }
    else{ 
        camImg.setAttribute("src", "/public/assets/camoff.png");
    }
    cameraOff = !cameraOff;
}

async function handleCameraChange(event){
    event.preventDefault();
    await getMedia(camerasSelect.value);
}


muteBtn.addEventListener("click", handleMuteStatus);
cameraBtn.addEventListener('click', handleCamStatus);
camerasSelect.addEventListener("input", handleCameraChange);



//welcome page =================================================
const welcomeForm = welcome.querySelector('form');

async function startMedia(){
    const entry = document.querySelector('.container');
    entry.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector('input');
    roomName = input.value;
    socket.emit('join_room', roomName, startMedia)
    input.value ="";
}
welcomeForm.addEventListener('submit',handleWelcomeSubmit);


//socket code =======================================================
socket.on('welcome', async ()=>{
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit('offer', offer, roomName);
});

socket.on('offer', (offer)=>{
    console.log(offer)
})
//rtc code ==============

function makeConnection(){
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(track=>{myPeerConnection.addTracks(track, myStream)})
}