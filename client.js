
// Variables
const serverURL = "wss://artistic-endurable-lifeboat.glitch.me";  // make sure you EDIT THIS!                                                             
// Client Initialization
const socket = io(serverURL);

let socketID = "";
let randomR, randomG, randomB;
// let clientInfo = "";

   var watchID;
    var geoLoc;

// Array to store other user locations
const otherUserLocations = [];

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
    // preloadAudio("sounds/014_whistle.mp3"),
    // preloadAudio("sounds/078_whistle.mp3"),
    // preloadAudio("sounds/107_whistle.mp3"),
    // preloadAudio("sounds/192_multiple_whistle.mp3"), 
    // preloadAudio("sounds/cat-purr-meow.mp3")
];

function playRandomAudio() {
    const audioIndex = Math.floor(Math.random() * audioArray.length);
    const audio = audioArray[audioIndex];
    audio.play();
}



// RECEIVE

socket.on("connect", () => {   
    // getClientInformation().then(clientInfo => {
    // getLocationUpdate();
    // console.log(clientInfo);
    // displayClientInformation();
    // clientInfo = clientInfo;
    // });
             
     console.log("Connected to server!");
    //  getLocation();
     socketID = socket.id;  // unique random 20-character id is given to client from server
     randomR = Math.floor(Math.random()*256);   // generate random colors for this client
     randomG = Math.floor(Math.random()*256);
     randomB = Math.floor(Math.random()*256);
  });

socket.on("bang", () => {
    document.getElementById("recieveBang").style.background="green";
    setTimeout( () => document.getElementById("recieveBang").style.background="", 100);
    // playRandomAudio()
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
    // socket.emit("bang");
});


// SEND


document.querySelector("#preloadAudioBtn").addEventListener('touchstart', () => {
  //  document.getElementById("containerb").style.visibility = "visible";
    //document.getElementById("preloadAudioBtn").style.visibility = "hidden";
    playRandomAudio()
});

document.querySelector("#preloadAudioBtn").addEventListener('click', () => {
    document.getElementById("containerb").style.visibility = "visible";
    document.getElementById("preloadAudioBtn").style.visibility = "hidden";
    // updateAndSendData();
   // playRandomAudio();
});

function updateAndSendData(){
    // getLocation().then((userLocation) => {
    // //   console.log('Location received:', userLocation);
    //   const newLat = userLocation.latitude;
    //   const newLong = userLocation.longitude;
    //   console.log(newLat);
    //   console.log(newLong);
    // }).catch((error) => {
    //     console.error('Error getting location:', error);
    // });

   
    // console.log(loc);
   
    // getClientInformation().then((clientInfo) => {
        // console.log(clientInfo.location);
    // clientInfo.location =
    // console.log('clientInfo', clientInfo);
    // socket.emit('clientInfo', clientInfo);
    // });
}

function updateUserLocation(position){
     getClientInformation().then((clientInfo) => {
        // console.log(position.latitude,position.longitude );
        clientInfo.latitude = position.latitude;
        clientInfo.longitude = position.longitude;
        // document.getElementById('latitude').innerHTML = `<strong>latitude:</strong> ${clientInfo.latitude}`;
        //  document.getElementById('longitude').innerHTML = `<strong>longitude:</strong> ${clientInfo.longitude}`;
     })

};

// https://www.tutorialspoint.com/html5/geolocation_watchposition.htm
         function showLocation(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            //  console.log("Latitude : " + latitude + " Longitude: " + longitude);
                    const updatedLocation = {
                    latitude,
                    longitude,
                    };
             console.log(updatedLocation);
            // console.log("UPDATING position");
            updateUserLocation(updatedLocation);
            return updatedLocation
            
         }
         
         function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            } else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }
 function getLocationUpdate(){
     if(navigator.geolocation){     
            // timeout at 60000 milliseconds (60 seconds)
            var options = {timeout:10000};
            geoLoc = navigator.geolocation;
            watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
            console.log(watchID);
            } else {
            alert("Sorry, browser does not support geolocation!");
            }
         }

document.querySelector("#sendBangBtn").onclick = () => {
    updateAndSendData();
    socket.emit("bang");
   
    //  showLocation(navigator.geolocation);
    // getLocationUpdate();
    // console.log(watchID);
    // getLocation().then((userLocation) => {
    //     console.log('Location received:', userLocation);
    //     // console.log('clientInfo', clientInfo);

    //     // Emit "location" event with the user's location
    //     socket.emit("location", userLocation);

    // }).catch((error) => {
    //     console.error('Error getting location:', error);
    // });
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