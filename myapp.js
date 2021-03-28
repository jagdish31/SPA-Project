const express = require("express");
const http = require('http');
const path = require("path"); 
const app = express();
const port = 80;
const bodyparser = require("body-parser");
const manifestUri =
    'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';


app.use('/assets', express.static('assets')) // For serving static files
app.use(express.urlencoded())

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const player = new shaka.Player(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);

// ENDPOINTS FOR VIDEOS AND IMAGES
app.get("/videos", (req, res)=>{ 
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get("/images", (req, res)=>{ 
  res.sendFile(path.join(__dirname + '/index2.html'));
});

app.listen(port, ()=>{
  console.log(`The application started successfully on port ${port}`);
});