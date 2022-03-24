const socket = io();
const display = document.getElementById("message-container");
const messageInput = document.getElementById('message-form');
const send = document.getElementById('Submit-message');

socket.on('message', message => {
    DisplayMessage(message, "My-Chat-App Bot")
    display.scrollTop = display.scrollHeight
})


/* Event listeners for clicks and enter*/
send.addEventListener('click', e => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === "") return
    userDisplayMessage(message, "Andrew Lin");
    messageInput.value = ""
})

document.addEventListener('keypress', e => {
    console.log("keypre")
    if (e.key === 'Enter') {
        const message = messageInput.value;
        if (message === "") return
        userDisplayMessage(message, "Andrew Lin");
        messageInput.value = ""
    }
})



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
}


function disconnectMessage(name) {
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

