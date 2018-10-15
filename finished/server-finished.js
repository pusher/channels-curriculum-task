// Import libraries
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const database = low(adapter)
const Pusher = require('pusher');

// Configure the express web server framework
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Initialise the database
database.defaults({ messages: [] }).write();

// Initialise Pusher Channels
const pusher = new Pusher({
    appId: 'xxxxx',
    key: 'xxxxx',
    secret: 'xxxxx',
    cluster: 'xxxxx',
    encrypted: true
});

// Handler for requests for existing messages
app.get('/getMessages', (request, response) => {
    // Retrieve the existing messages from the database
    let messageList = database.get('messages').value();

    // Return the messages to the browser
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messageList));
});

// Handler for requests posting new messages
app.post('/newMessage', (request, response) => {
    // Get the contents of the message from the browser request
    let message = request.body.messageText;
    // Get the ID for the message sender
    let socketId = request.body.socketId;

    // Send message to users with window open, exlude the sender
    pusher.trigger('chat-app', 'new-message', { message }, socketId);

    // Write new message to database
    database.get('messages')
        .push({text:message})
        .write();

    // Let the browser know everything was OK
    response.sendStatus(200);
});
 
// Start the webserver
app.listen(3000, () => console.log('Server listening on port 3000!'));