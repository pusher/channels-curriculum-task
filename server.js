// Import libraries
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const database = low(adapter)

// Configure the express web server framework
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Initialise the database
database.defaults({ messages: [] }).write();

// Initialise Pusher Channels
// Add Channels connection code here

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

    // Send message to users with window open
    // Add Channels trigger here

    // Write new message to database
    database.get('messages')
        .push({text:message})
        .write();

    // Let the browser know everything was OK
    response.sendStatus(200);
});
 
// Start the webserver
app.listen(3000, () => console.log('Server listening on port 3000!'));