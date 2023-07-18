/* The original code for this file was taken from 
 * "https://hackernoon.com/build-a-chat-room-with-socketio-and-express".
 * I have added these variables and functions:
 *   * audioNewMention
 *   * messagesLoaded
 *   * isMentionCheck(text, userName)
 *   * "connection-refused" event handler
 *   * "old-messages-ready" event handler
 * 
 * I have modified these functions:
 *   * createMessage
 *     - added code to detect mentions
 *     - added separate styling for system messages, and mentions
 *     - added user names to messages received
 *   * "receive-message" event handler
 *     - detect mentions
 *     - trigger mention notification
 *   * "send-message" event handler
 *     - Added a callback to confirm that message was sent and saved
 *     - Display a system message if message was not sent  
 */
const messageBox = document.querySelector("#messages");
const textBox = document.querySelector("input");
const sendButton = document.querySelector("button");
const audioNewMention = document.querySelector("#audio-new-mention");
var messagesLoaded = false;

/** Return true if "text" mentions "@userName".
 * */
 
function isMentionCheck(text, userName) {
  userName = userName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  index = text.search(new RegExp("\\b"+userName+"\\b", "i"));
  return index > 0 && text[index - 1] == '@';
}

/** Add a message to the browser view. Check whether the message is:
 *   * a system message - display as a centered grey box
 *   * an incoming message - display in left hand amber box
 *   * a mention - diplay in indented left hand green box
 *   * an outgoing message - display in right hand blue box
 * */
 
function createMessage(text, user=null) {
  // Check for a mention of this user
  const isMention = isMentionCheck(text, userName);
  
  
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message";
  const subMessageElement = document.createElement("div");
  subMessageElement.className ="px-4 py-4 rounded-lg inline-block rounded-bl-none";
  // make the target text element swappable
  var textElement = subMessageElement;
  if( user === null) {
    // system message/warning to the user
    messageElement.className = "flex justify-center items-center"
    subMessageElement.className += " bg-gray-300 text-gray-600";
  } else if( user === true || user.id == userId ) {
    // This is the user's own message - display it on the right
    subMessageElement.className += " float-right bg-blue-800 text-white";
  } else {
    // Display incomming message on the left
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
  
  // Scroll to most recent message
  subMessageElement.scrollIntoView(false);
  messageBox.scrollTop = messageBox.scrollHeight;
  return isMention;
}

const socket = io({query: {userId: userId}});

socket.on("connection", (socket) => {
  console.log(socket.id);
});

socket.on("connection-refused", (message) => {
  createMessage(`Connection refused for "${userName}". ` + message);
});

socket.on("old-messages-ready", (oldMessages) => {
  if( messagesLoaded === false ) {
    // Try to display all old messages
    if( oldMessages === false ) {
      // Inform the user that messages could not be reloaded.
      createMessage("Failed to load old messages");
    } else {
      // Display all previously saved messages
      for(let message of oldMessages) {
        createMessage(message.content, {
          id: message.from_user_id, userName: message.user_name});
      }
      messagesLoaded = true;
    }
  }
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
  
  // Try to enable notifications for mentions
  if ( "Notification" in window && Notification.permission !== "granted"
    && Notification.permission !== "denied") 
  {
    Notification.requestPermission();}
    
  if( !audio_allowed ) {
    createMessage("It looks like you have autoplay disabled. Please enable autoplay if you wish to hear alerts.")
  }
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
        `${user.userName} has messaged you in chat`);
      
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
    socket.emit("send-message", textBox.value, userId, (response) => {
      if( response.ok ) {
        // Display the message sent by this user in their own browser
        createMessage(textBox.value, true);
        textBox.value = "";
      } else {
        // Inform the user that their message was not sent.
        createMessage(response.error);
      }
    });
  }
});
