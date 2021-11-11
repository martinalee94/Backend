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

async function handleCameraChange(){
    await getMedia(camerasSelect.value); //함수가 호출되면 새로운 media stream을 받음
    if(myPeerConnection){//myStream은 내 화면에서 스트림
        const videoTrack = myStream.getVideoTracks()[0] //새로운 비디오 트랙 받는다
        //sender는 peer로 보내진 media stream track을 컨트롤하게 도와줌
        //sender에서 video를 보내는 sender만 골라냄(sender의 track에서 kind가 'video'인 것들만)
        const videoSender = myPeerConnection.getSenders().find(sender => sender.track.kind === 'video'); 
        videoSender.replaceTrack(videoTrack) //video 재설정
    }
}


muteBtn.addEventListener("click", handleMuteStatus);
cameraBtn.addEventListener('click', handleCamStatus);
camerasSelect.addEventListener("input", handleCameraChange);



//welcome page =================================================
const welcomeForm = welcome.querySelector('form');

async function initCall(){
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
    await initCall(); //양방향 통신이 빠르게 일어나서 peer의 정보를 받기도 전에 정보를 셋팅하려고하므로, 우선 call한다 
    socket.emit('join_room', roomName)
    input.value ="";
}
welcomeForm.addEventListener('submit',handleWelcomeSubmit);



//socket code =======================================================
socket.on('welcome', async ()=>{ //brave가실행
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer); //내정보를 셋팅해서 peer에게 전달
    socket.emit('offer', offer, roomName);
});

socket.on('offer',  async (offer)=>{  //firefox 가 실행
    myPeerConnection.setRemoteDescription(offer); //내가 아닌 peer의 정보를 셋팅
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer); 
    socket.emit('answer', answer, roomName); //firefox 가 답변

})

socket.on('answer', (answer)=>{
    myPeerConnection.setRemoteDescription(answer);  //brave 가 firefox한테 받은 답변으로 셋팅

})

socket.on('ice', (ice)=>{ //다른 브라우저의 ice candidate를 받음, offer/answer를 받을 때 candidate도 받음!
    myPeerConnection.addIceCandidate(ice); //받아서 저장함
})




//rtc code ==============
function makeConnection(){
    myPeerConnection = new RTCPeerConnection();  //create peer to peer connection
    //서로다른 브라우저간 소통하게 만들어줌
    //각 브라우저에서 ice candidate를 만든다, 각자 본인이 어떻게 다른 브라우저와 소통하는지 알려주는 것
    myPeerConnection.addEventListener("icecandidate", handleIce); 
    //채팅방에 들어온 사람 stream을 추가해준다
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream.getTracks().forEach((track)=>{myPeerConnection.addTrack(track, myStream)}) //peer연결에 track을 추가
}

function handleIce(data){
    //ice candidate를 받으면 서버로 보냄, 다른 브라우저에서 서로 candidate를 주고받음
    socket.emit('ice', data.candidate, roomName); 
    console.log('got ice!')
    console.log(data)
}

function handleAddStream(data){ //got an stream from my peer
    const peersStream = document.querySelector('#peerFace');
    peersStream.srcObject = data.stream; //내가 받은 remote stream으로 peerface video에 넣어준다
}