const socket = io();
const display = document.getElementById("message-container");
const messageInput = document.getElementById('message-form');
const send = document.getElementById('Submit-message');
const roomname = parseURLParam("Roomname")
const username = parseURLParam("Username")

/* get current location */
// Gets the Parameters

function parseURLParam(Parameter) {
    var FullURL = window.location.search.substring(1);
    console.log(FullURL);
    var ParamArr = FullURL.split('&');
    console.log(ParamArr);
    for (var i = 0; i < ParamArr.length; i++) {
        var currentParam = ParamArr[i].split('=');
        if (currentParam[0] == Parameter) {
            return currentParam[1];
        }
    }
}

function wrap() {
    const Room_banner = document.getElementById('Content-Name');
    Room_banner.textContent = roomname;
    socket.emit('joinRoom', {username, roomname});
}
wrap();

socket.on('welcome', message => {
    DisplayMessage(message, "My-Chat-App Bot")
})

socket.on('join-message', message => {
    joinMessage(message, "My-Chat-App Bot")
})

socket.on('disconnect', message => {
    disconnectMessage(message, "user")
})

socket.on('message', message => {
    DisplayMessage(message.message, message.name)
})


/* Event listeners for clicks and enter*/
send.addEventListener('click', e => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === "") return
    userDisplayMessage(message, username);
    messageInput.value = ""
})

document.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const message = messageInput.value;
        if (message === "") return
        userDisplayMessage(message, username);
        messageInput.value = ""
    }
})


// When 'you' the user sends a message
function userDisplayMessage(message, name) {
    const d = new Date();
    const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userdiv = document.createElement("div")
    userdiv.classList.add('user-message');
    userdiv.innerHTML = `<div class="user-messenger">
        ${name}&nbsp;<span>${event}</span>
        </div>
            <div class="user-messenge-box">
            <p class="user-message-content">
                ${message}
            </p>
        </div>`
    display.appendChild(userdiv);
    display.scrollTop = display.scrollHeight

    //Emit message
    socket.emit('chat message', {name, message});
}


function disconnectMessage(message, name) {
    const d = new Date();
    const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const div = document.createElement("div");
    div.classList.add("disconnect-message");
    div.innerHTML = `<p class="disconnect-content">
            ${name} has left &nbsp;<span>${event}</span>
                </p>`
    display.appendChild(div);
    display.scrollTop = display.scrollHeight
}

function joinMessage(message, name) {
    const d = new Date();
    const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const div = document.createElement("div");
    div.classList.add("disconnect-message");
    div.innerHTML = `<p class="disconnect-content">
            ${message}&nbsp;<span>${event}</span>
                </p>`
    display.appendChild(div);
    display.scrollTop = display.scrollHeight
}



function DisplayMessage(message, name) {
    const d = new Date();
    const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const div = document.createElement("div")
    div.classList.add('message');
    div.innerHTML = `<div class="messenger">
            ${name} &nbsp;<span>${event}</span>
            </div>
            <div class="messenge-box">
                <p class="message-content">
                    ${message}
                </p>
            </div>`
    display.appendChild(div);
    display.scrollTop = display.scrollHeight
}

/*automatically updates scroll*/
function updateScroll(){
    display.scrollTop = display.scrollHeight;
}
setInterval(updateScroll,1000);

