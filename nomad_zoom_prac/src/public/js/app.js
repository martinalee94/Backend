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
        //console.log(myStream);
        myFace.srcObject = myStream;
        await getCameras();
    } catch(e){
        console.log(e)
    }
}

getMedia();

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput')
        cameras.forEach((camera)=>{
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label;
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
muteBtn.addEventListener("click", handleMuteStatus);
cameraBtn.addEventListener('click', handleCamStatus);