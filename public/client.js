const socket = io();

const form = document.getElementById('send-form');
const userMessage = document.getElementById('user-message')
const messageContainer = document.querySelector(".chat-section")

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);


socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'message-center')
})

/** function when user received the message */
socket.on('message-receive', data => {
    append(`${data.name}: ${data.message}`, 'message-left')
})

/** socket function when user left the chat */
socket.on('user-left', name => {
    append(`${name} left the chat`, 'message-center')
})

/** Adding message to the container */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userMessage.value;
    append(`You: ${message}`, 'message-right');
    socket.emit('send-message', message);
    userMessage.value = ''
})