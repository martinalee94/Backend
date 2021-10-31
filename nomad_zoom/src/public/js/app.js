const socket = io(); //front에 io 연결 socket id 가 자동으로 부여되어서 구분할 수 있음
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector('#mute');
const cameraBtn = document.querySelector('#camera');
const camerasSelect = document.querySelector('#cameras');

let myStream;
let muted = false;  //mute와 카메라 상태를 체크하는 변수
let cameraOff = false;

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
getMedia();

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
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);