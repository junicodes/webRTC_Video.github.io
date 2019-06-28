// the user ID Token
let initHolder;
let receiverHolder;
const socket = io('http://localhost:4000/');

//Control the view if the user is not on init condition

//Activate the video and audio of the browser
const constraints = { audio: true, video: true }
console.log(window);
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
    document.querySelector('#yourId').value = JSON.stringify(data)

    //Convert to an array with the user data to identify
    const msg = {
        urlInit: urlInit,
        urlReceiver: urlReceiver,
        data: JSON.stringify(data)
      };

    //Emmit a socket connection to the the other video chat user by transfering the init generated token
    socket.emit('you.message', msg)
  })
  //This control the receivers when accepting the connection
  document.querySelector('#connect').addEventListener('click', function (e) {
    e.preventDefault()
    const receiverId = JSON.parse(document.querySelector('#receiverId').value)

    //Overides the user info
    urlInit     = urlActive;
    urlReceiver = initHolder;
    //this signals a conn to generate a code
    peer.signal(receiverId);
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
   video.style.display = "block";
   video.srcObject=stream;
   // video.src = window.URL.createObjectURL(stream)
   video.play()
 })
 socket.on('you.message', function(message) {
   let urlInit = parsedUrl.searchParams.get("initiator");
   let urlReceiver = parsedUrl.searchParams.get("receiver");
   let urlActive = parsedUrl.searchParams.get("active");
   // console.log(message.urlReceiver);
     //Check if this the correct user to chat with
     if (urlActive === message.urlReceiver) {
         console.log(message);
         const receiverInput = document.querySelector('#receiverId');
         const info_noctice = document.querySelector('#noctice_block');
         initHolder = message.urlInit;
         $('#connect').css('display', 'block');

         receiverInput.value = message.data;
         info_noctice.textContent = `You have a call from ${initHolder}`;
     }
     if (urlInit === message.urlReceiver) {
         console.log(message);
         const receiverInput = document.querySelector('#receiverId');
         const info_noctice = document.querySelector('#noctice_block');
         receiverHolder = message.urlReceiver;
         receiverInput.value = message.data;
         info_noctice.textContent = `connected to ${receiverHolder}`;

         const receiverId = JSON.parse(document.querySelector('#receiverId').value)
         console.log(receiverId);
         //this signals a conn to generate a code
         peer.signal(receiverId);
     }
     if (urlActive === message.urlInit || urlInit === message.urlReceiver) {
       $('.message_block').css('display', 'block');
       $('#send').attr("disabled", false);
       $('#yourMessage').attr("disabled", false);
     }

 });

})
.catch(function(err) {
  /* handle the error */
  console.log(err)
});
