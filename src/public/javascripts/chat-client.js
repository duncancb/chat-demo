const messageBox = document.querySelector("#messages");
const textBox = document.querySelector("input");
const sendButton = document.querySelector("button");
const audioNewMention = document.querySelector("#audio-new-mention");

function createMessage(text, user=null) {
  const isMention = text.search(`@${userName}`) > -1;
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message";
  const subMessageElement = document.createElement("div");
  subMessageElement.className ="px-4 py-4 rounded-lg inline-block rounded-bl-none";
  var textElement = subMessageElement;
  if( user === null) {
    // System message/warning to the user
    messageElement.className = "flex justify-center items-center"
    subMessageElement.className += " bg-gray-300 text-gray-600";
  } else if( user === true || user.id == userId ) {
    // This is the user's own message - display it on the right
    subMessageElement.className += " float-right bg-blue-800 text-white";
  } else {
    // Display message from another user on the left
    const subMessageTitle = document.createElement("b");
    subMessageTitle.innerText = `${user.userName}:`;
    
    // Normal messages and mentions have different styles
    if( isMention ) {
      subMessageElement.className += " ml-5 drop-shadow-md bg-lime-200 text-red-800";
      subMessageTitle.className = "text-blue-800";
    } else {
      subMessageElement.className += " bg-amber-100 text-amber-950";
      subMessageTitle.className = "text-red-800";
    }
    
    // Add the message to the DOM
    subMessageElement.appendChild(subMessageTitle);
    textElement = document.createElement("div");
    subMessageElement.appendChild(textElement);
  }
  textElement.innerText = text;
  messageElement.appendChild(subMessageElement);

  messageBox.appendChild(messageElement);
  return isMention;
}

const socket = io({query: {userId: userId}});

socket.on("connection", (socket) => {
  console.log(socket.id);
});

socket.on("connection-refused", (message) => {
  createMessage(`Connection refused for "${userName}". ` + message);
});

socket.on("receive-message", (message, user) => {
  const isMention = createMessage(message, user);
  if( isMention ) {
    // Have browser play a sound if possible
    var promise = audioNewMention.play();
    if( promise != undefined ) {
      promise.catch(err => {})
    }
    // Send a notification if possible
    if (Notification.permission === "granted") {
      const notification = new Notification(
        `${user.userName} has messaged you in chat`
);
      
      // Add click listener that will perform a window focus
      notification.onclick = function (x) {
        window.focus();
        this.close();
      };
      setTimeout(function() { notification.close() }, 5000);
    }
  }
});

sendButton.addEventListener("click", () => {
  if (textBox.value != "") {
    socket.emit("send-message", textBox.value, userId);
    createMessage(textBox.value, true);
    textBox.value = "";
  }
});

// Try to warn the user if they need to enable audio autoplay
window.onload = function () {
  // Try to enable audio alert for mentions
  let audio_allowed;
  if( navigator.getAutoplayPolicy ) {
    audio_allowed = navigator.getAutoplayPolicy("audiocontext") == "allowed";
  } else {
    var promise = audioNewMention.play();
    if( promise != undefined ) {
      promise.catch(err => {audio_allowed = false;})
    } else {
      audio_allowed = false;
    }
    audioNewMention.pause();
    audioNewMention.currentTime = 0;
  }
  if( !audio_allowed ) {
    createMessage("It looks like you have autoplay disabled. Please enable autoplay if you wish to hear alerts.")
  }
  
  // Try to enable notifications for mentions
  if ( "Notification" in window && Notification.permission !== "granted"
    && Notification.permission !== "denied") 
  {
    Notification.requestPermission();}
};
