//Activate the video and audio of the browser
const constraints = { audio: false, video: true }

navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  /* use the stream */
  console.log(stream)

  //here we required the Peer Instantiate the class
  let Peer = require('simple-peer');
  //Instatiate a peer
  let peer = new Peer({
    //Here we need to know who is initiating this connection
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })
  peer.on('error', function (err) { console.log('error', err) })
  //here we are going to triger the peer connection and insert the generated token into the initiator token field
  peer.on('signal', function (data) {
    console.log(data)
    document.querySelector('#yourId').value = JSON.stringify(data)
  })
  //This control the receivers when accepting the connection
  document.querySelector('#connect').addEventListener('click', function (e) {
    e.preventDefault()
    const receiverId = JSON.parse(document.querySelector('#receiverId').value)
    console.log(receiverId);
    //this signals a conn to generate a code
    peer.signal(receiverId)
  })
  //This alert that there is a connection
  peer.on('connect', function () {
    console.log('CONNECT')
    peer.send('whatever' + Math.random())
  })
  //We use this to send data from one peer to another
  document.querySelector('#send').addEventListener('click', function() {
    const yourMessage = document.querySelector('#yourMessage').value
    peer.send(yourMessage)
  });
  //We receive the data back from the opposite peer
  peer.on('data', function(data) {
    console.log(data);
    document.querySelector('#messages').textContent += `${data}\n`;
  });
  peer.on('stream', function (stream) {
    console.log(stream);
   // got remote video stream, now let's show it in a video tag
   var video = document.querySelector('video')
   video.srcObject=stream;
   // video.src = window.URL.createObjectURL(stream)
   video.play()
 })
  // peer.on('stream', function (stream) {
  //   console.log(stream);
  //   let video = document.createElement('video')
  //   document.body.appendChild(video)
  //
  //   video.src = window.URL.createObjectURL(stream);
  //   video.play();
  // })

})
.catch(function(err) {
  /* handle the error */
  console.log(err)
});
