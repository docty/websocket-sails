const socket = io('http://127.0.0.1:5000/');

const inboxPeople = document.querySelector('.inbox_people');
const inputField = document.querySelector('.message_from_input');
const messageForm = document.querySelector('.message_form');
const messageBox = document.querySelector('.messages_history');
const fallback = document.querySelector('.fallback');
const inboxMessages = document.querySelector('.inbox_messages');

let userName = '';

const newUserConnected = () => {
    userName = `User${Math.floor(Math.random()*10000)}`;
    socket.emit('new user', userName);
}

const addToUsersBox = (userName) => {
    if (document.querySelector(`.${userName}-userlist`))
        return;

    const userBox =    `
        <div class="chat_ib ${userName}-userlist">
            <p>${userName}</p>
        </div>
        `;
    inboxPeople.innerHTML += userBox;   
}

const addNewMessage = ({user, message}) => {
    const time = new Date();
    const formattedTime = time.toLocaleString('en-Us', {hour: 'numeric', minute: 'numeric'});

    const receivedMessage = `
    <div class="incoming_message">
        <div class="received_message">
            <p>${message}</p>
            <div class="message_info">
                <span class="message_author">${user}</span>
                <span class="time_date">${formattedTime}</span>
            </div>
        </div>
    </div    
    `;

    const myMsg = `
    <div class="outgoing_message">
        <div class="sent_message">
            <p>${message}</p>
            <div class="message_info">
                <span class="time_date">${formattedTime}</span>
            </div>
        </div>
    </div    
    `;
    messageBox.innerHTML += user === userName ? myMsg : receivedMessage;
    inboxMessages.scrollTo(0, inboxMessages.scrollHeight);
}

newUserConnected();


messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!inputField.value) return;

    socket.emit('chat message', {
        message: inputField.value,
        nick : userName,
    });
    
    inputField.value = '';
});

inputField.addEventListener('keyup', () => {
    
    socket.emit('typing', {
        isTyping: inputField.value.length > 0,
        nick : userName,
    });
});

socket.on('connect', () => {
    console.log(socket.id)
    socket.on('new user', (data) => {
        data.map(user => addToUsersBox(user))
    });
    
    socket.on('user disconnected', (userName) => {
        document.querySelector(`.${userName}-userlist`).remove();
    });
    
    socket.on('chat message', function(data) {
        addNewMessage({user: data.nick, message:data.message});
    });
    
    socket.on('typing', function(data) {
        const {isTyping, nick} = data;
    
        if(!isTyping) {
            fallback.innerHTML = '';
            return;
        }
    
        fallback.innerHTML = `<p>${nick} is typing...</p>`;
    });     
});
