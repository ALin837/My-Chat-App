const socket = io();
const display = document.getElementById("message-container");
const messageInput = document.getElementById('message-form');
const send = document.getElementById('Submit-message');
const roomname = parseURLParam("Roomname")
const username = parseURLParam("Username")
const userlist = document.getElementById("user-list")

/* get current location */
// Gets the Parameters

function parseURLParam(Parameter) {
    var FullURL = window.location.search.substring(1);
    var ParamArr = FullURL.split('&');
    for (var i = 0; i < ParamArr.length; i++) {
        var currentParam = ParamArr[i].split('=');
        if (currentParam[0] == Parameter) {
            return currentParam[1];
        }
    }
}
socket.on('My Error', response => {
    window.alert(response);
    window.location.href = 'index.html'
})

function wrap() {
    const Room_banner = document.querySelectorAll('#Content-Name h2');
    Room_banner[0].textContent = roomname;
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML = `<i class="fa-solid fa-user"></i> ${username}`;
    userlist.appendChild(div);
    socket.emit('joinRoom', {username, roomname});
}
wrap();

socket.on('welcome', response => {
    DisplayMessage(response.message, response.name)
})

socket.on('join-message', response => {
    joinMessage(response)
})

/*users not being updated in real time*/
socket.on('new-user', response => {
    //iterates through the user list
    userlist.innerHTML = `<div class="user"> 
    <i class="fa-solid fa-user"></i>${username}
    </div>`
    for (let i = 0; i < response.length; i++) {
        if (response[i].username !== username) {
            addUserToList(response[i].username)
        }
    }
})

socket.on('disconnection', user => {
    disconnectMessage(user)
})

socket.on('message', Obj => {
    DisplayMessage(Obj.message, Obj.name)
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



//Add users to user list
function addUserToList(name) {
    const div = document.createElement("div");
    div.classList.add("user");
    div.innerHTML = `${name}`;
    userlist.appendChild(div);
    
}

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


function disconnectMessage(name) {
    const d = new Date();
    const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const div = document.createElement("div");
    div.classList.add("disconnect-message");
    div.innerHTML = `<p class="disconnect-content">
            ${name} has left the chat&nbsp;<span>${event}</span>
                </p>`
    display.appendChild(div);
    display.scrollTop = display.scrollHeight
}

function joinMessage(name) {
    const d = new Date();
    const event = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const div = document.createElement("div");
    div.classList.add("disconnect-message");
    div.innerHTML = `<p class="disconnect-content">
            ${name} has joined the chat&nbsp;<span>${event}</span>
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

/*automatically updates scroll
function updateScroll(){
    display.scrollTop = display.scrollHeight;
}
setInterval(updateScroll,1000);
*/

