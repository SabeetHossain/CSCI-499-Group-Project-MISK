document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('new_message', function(msg) {
        console.log('New message - ', msg);
        let messages = document.getElementById('messages');
        let message = document.createElement('p');
        message.innerText = msg.data;
        messages.appendChild(message);
    });

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });
});
