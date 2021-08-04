const inboxPeople = document.querySelector('.inbox_people');
const inputField = document.querySelector('.message_from_input');
const messageForm = document.querySelector('.message_form');
const messageBox = document.querySelector('.messages_history');
const fallback = document.querySelector('.fallback');
const inboxMessages = document.querySelector('.inbox_messages');
const name = prompt('Enter username');

(function(){
	const script = document.createElement('script');
	script.src = './sails.io.js';
	script.onload = function () {
		io.sails.url = 'http://127.0.0.1:1337';
		io.socket.on('connect', function(){
			io.sails.handshake = {'l':'fff'};
			io.socket.get('http://127.0.0.1:1337/api/v1/join', {userName: name});
			io.socket.on('new user', function(data){
				data.map(user => addToUsersBox(user))
			});
			io.socket.on('message', function(data){
				addNewMessage({user: data.nick, message:data.message});
			});
			io.socket.get('http://127.0.0.1:1337/api/v1/message');
			io.socket.on('readAll', function(data){
				data.map(value => addNewMessage({user: value.userName, message:value.textContent}));
			});
			io.socket.on('user disconnected', (userName) => {
				document.querySelector(`.${userName}-userlist`).remove();
			});
		});
	}
	document.body.appendChild(script);
})()



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
    messageBox.innerHTML += user === name ? myMsg : receivedMessage;
    inboxMessages.scrollTo(0, inboxMessages.scrollHeight);
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!inputField.value) return;

    io.socket.post('http://127.0.0.1:1337/api/v1/message', {
        message: inputField.value,
        nick : name,
    });
    
    inputField.value = '';
});