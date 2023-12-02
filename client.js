
// Variables
const serverURL = "wss://artistic-endurable-lifeboat.glitch.me";  // make sure you EDIT THIS!
                                                               
// Client Initialization
const socket = io(serverURL);

let socketID = "";
let randomR, randomG, randomB;


// Function to preload audio
function preloadAudio(url) {
    const audio = new Audio();
    audio.src = url;
    audio.preload = "auto";
    
    // Optionally, you can attach an event listener to handle the 'loadeddata' event
    audio.addEventListener('loadeddata', () => {
        console.log(`Audio ${url} preloaded successfully`);
    });
    
    return audio;
}


// Preload each audio file and add it to the audioArray
const audioArray = [
    preloadAudio("sounds/014_whistle.mp3"),
    preloadAudio("sounds/078_whistle.mp3"),
    preloadAudio("sounds/107_whistle.mp3"),
    preloadAudio("sounds/192_multiple_whistle.mp3"), 
    preloadAudio("sounds/cat-purr-meow.mp3")
];

function playRandomAudio() {
    const audioIndex = Math.floor(Math.random() * audioArray.length);
    const audio = audioArray[audioIndex];
    audio.play();
}

document.querySelector("#preloadAudioBtn").addEventListener('touchstart', () => {
  //  document.getElementById("containerb").style.visibility = "visible";
    //document.getElementById("preloadAudioBtn").style.visibility = "hidden";
    playRandomAudio()
});

document.querySelector("#preloadAudioBtn").addEventListener('click', () => {
    document.getElementById("containerb").style.visibility = "visible";
    document.getElementById("preloadAudioBtn").style.visibility = "hidden";
   // playRandomAudio();
});


// RECEIVE

socket.on("connect", () => {            
     console.log("Connected to server!");
     socketID = socket.id;  // unique random 20-character id is given to client from server
     randomR = Math.floor(Math.random()*256);   // generate random colors for this client
     randomG = Math.floor(Math.random()*256);
     randomB = Math.floor(Math.random()*256);
  });

socket.on("bang", () => {
    document.getElementById("recieveBang").style.background="green";
    setTimeout( () => document.getElementById("recieveBang").style.background="", 100);
    playRandomAudio()
});

socket.on("message", myJSobj => {
    const newLine = document.querySelector("#chatMessage");
    let logo = ``;
    if(myJSobj.fromMax){
        logo = ` <img src="cycling74.png" style="vertical-align:middle; height: 15px"> `
    } else {
        logo = ` <span style="width: 15px; height: 15px; margin:auto; display: inline-block; vertical-align: middle; background: rgb(${myJSobj.color[0]}, ${myJSobj.color[1]}, ${myJSobj.color[2]})"></span> `
    };
    // newLine.innerHTML += `<span style="font-family: monospace">${myJSobj.id.substring(0,3)}</span>`
    newLine.innerHTML += logo;
    newLine.innerHTML += `${myJSobj.message}<br/>`;

    //playRandomAudio()
    socket.emit("bang");
});


// SEND

document.querySelector("#sendBangBtn").onclick = () => {
    socket.emit("bang");
};

document.querySelector("#sendBtn").onclick = () => {
    let textBox = document.querySelector("#inputBox");  // select the input box
    const newMessage =                                  // create an object to send
    {
        id: socketID,
        color: [randomR, randomG, randomB],        
        message: textBox.value,                         // get value from the input box
        fromMax: 0
    };
    socket.emit("message", newMessage );                // send the object to the server to send everyone
    inputBox.value = "";                                // clear the input box once the message is sent
};

// the enter key is only listened to if the cursor is in the input typing box
document.querySelector("#inputBox").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector("#sendBtn").click();
    };
});