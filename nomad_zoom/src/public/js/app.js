const socket = io(); //front에 io 연결 socket id 가 자동으로 부여되어서 구분할 수 있음
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector('#mute');
const cameraBtn = document.querySelector('#camera');
const camerasSelect = document.querySelector('#cameras');
const call = document.querySelector("#call")

call.hidden = true;
let myStream;
let muted = false;  //mute와 카메라 상태를 체크하는 변수
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras(){
    try{
      const devices = await navigator.mediaDevices.enumerateDevices(); //user의 devices 정보를 얻어온다
      const cameras = devices.filter(device => device.kind ==='videoinput'); //device중에 camera만 얻어옴
      const currentCamera = myStream.getVideoTracks()[0]; 
      cameras.forEach(camera =>{
          const option = document.createElement("option");
          option.value = camera.deviceId;
          option.innerText = camera.label;
          if(currentCamera.label === camera.label){
              option.selected = true;  //내가 현재 사용하고 있는 camera를 셀렉트 옵션에서 보여주도록 설정
          }
          camerasSelect.appendChild(option);  //camera 선택하는 탭
      })
    } catch(e){
        console.log(e);
    }
}
async function getMedia(deviceId){
    const initialConstrains ={ //맨처음 getmedia불렸을때, 카메라 설정이 아무것도 없을때
        audio : true,
        video:{ facingMode : 'user'},
    }
    const cameraConstraints={
        audio:true,
        video:{deviceId: {exact:deviceId}},
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstrains
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
    } catch(e){
        console.log(e);
    }
}


function handleMuteClick(){
    myStream.getAudioTracks().forEach((track)=>{
        track.enabled = !track.enabled;
    })
    if(!muted){ //mute로 바뀜
        muteBtn.innerText = "Unmute";
        muted = true;
    } else{ //unmute로 바뀜
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraClick(){
    myStream.getVideoTracks().forEach((track)=>{
        track.enabled = !track.enabled;
    })

    if(cameraOff){ //카메라가 꺼져있을때 클릭하면 카메라가 켜짐
        cameraBtn.innerText = 'Turn Camera Off';
        cameraOff = false;
    } else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange(){
    await getMedia(camerasSelect.value); 
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0]; //this is for me
        const videoSender = myPeerConnection.getSenders().find(sender => sender.track.kind === "video");
        //peer로 보내진 media stream을 컨트롤 할 수 있는 것 = sender
        videoSender.replaceTrack(videoTrack); //this is for peer display
    }
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);



//welcome form (choose a room)
const welcome = document.querySelector("#welcome")
welcomeForm = welcome.querySelector('form');
async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}
async function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector('input');
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value ="";
}
welcomeForm.addEventListener('submit',handleWelcomeSubmit);

socket.on("welcome", async ()=>{ //원래 방ㅇ ㅔ참가해 있던 사람
    console.log('somebody joined');
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
    console.log('sent the offer');
})

socket.on("offer", async (offer)=>{ //새로 방에 입장한 사람
    console.log("received the offer")
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
})

socket.on("answer", answer =>{
    console.log("recived the answer");
    myPeerConnection.setRemoteDescription(answer);
})
socket.on('ice', ice =>{
    myPeerConnection.addIceCandidate(ice);
})
//rtc code
function makeConnection(){
    myPeerConnection = new RTCPeerConnection(); //ptp 연결만듦
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream.getTracks().forEach(track=>myPeerConnection.addTrack(track, myStream)); //양쪽 비디오 오디오 정보를 받아왔음
}

function handleIce(data){
    console.log('sent candidate');
    socket.emit('ice', data.candidate, roomName);
}
function handleAddStream(data){
    const peersFace = document.querySelector("#peersFace");
    console.log("got an event from my peer");
    peersFace.srcObject = data.stream;
}