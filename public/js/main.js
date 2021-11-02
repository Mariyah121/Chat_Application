const chatForm = document.getElementById('chat-form');
const chatMesssages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Join Chatroom
socket.emit('joinRoom', { username, room });

//Get Room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server 
socket.on('message', message => {
    console.log(message);
    outputMessage(message)

    //Scroll down
    chatMesssages.scrollTop = chatMesssages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // want to pass an event parameter because when you submit a form it automtically
    //just submits to a file and we want to stop that from happening.
    // so we use e.prevent.default to prevent the default behaviour.

    //retrieves the text input
    const msg = e.target.elements.msg.value;

    //Emits message to the server
    socket.emit('chatMessage', msg);

    //Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span>
</p>
<p class="text">
${message.text}
</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}