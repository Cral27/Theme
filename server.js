const express = require("express");
const app = express();
const session = require('express-session');
const server = app.listen(1337, function(){
    console.log('Listening on port 1337');
});

// more new code:
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))


const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/static"));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
//copy until this line

app.get('/', function(req, res){
    res.render('index');
})

let currentColor = 'white';

io.on('connection', function(socket){
    socket.on('beta', function(data){
        console.log(data.color);
        currentColor = data.color;
        io.emit('updateColor', {color: data.color});
    });

    //to make sure it has the color when initiating new browser
    socket.emit('updateColor', {color: currentColor});
});
