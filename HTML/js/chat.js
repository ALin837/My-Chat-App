//const socket = io();
const display = document.getElementById("message-container");
const messageInput = document.getElementById('message-form');
const send = document.getElementById('Submit-message');

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
    const hour = d.getHours();
    const minutes = d.getMinutes();
    const userdiv = document.createElement("div")
    userdiv.classList.add('user-message');
    userdiv.innerHTML = `<div class="user-messenger">
        ${name}&nbsp;<span>7:30pm</span>
        </div>
            <div class="user-messenge-box">
            <p class="user-message-content">
                ${message}
            </p>
        </div>`
    display.appendChild(userdiv);
}


function disconnectMessage(name) {
    const d = new Date();
    const hour = d.getHours();
    const minutes = d.getMinutes();
    const div = document.createElement("div");
    div.classList.add("disconnect-message");
    div.innerHTML = `<p class="disconnect-content">
            ${name} has left &nbsp;<span>7:30pm</span>
                </p>`
    display.appendChild(div);
}


function DisplayMessage(message, name) {
    const d = new Date();
    const hour = d.getHours();
    const minutes = d.getMinutes();
    const div = document.createElement("div")
    div.classList.add('message');
    div.innerHTML = `<div class="messenger">
            ${name} &nbsp;<span>7:30pm</span>
            </div>
            <div class="messenge-box">
                <p class="message-content">
                    ${message}
                </p>
            </div>`
    display.appendChild(div);
}


socket.on('message', message => {
    DisplayMessage(message, "My-Chat-App Bot")
})