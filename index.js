var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongo = require('mongodb'),
    monk = require('monk');

db = monk('localhost:27017/chat');

var port = 3700;
users = [];
rooms = [];
var app = express();

app.locals.db = db;

//Configuration
app.configure(function(){
    app.set('port', process.env.PORT || port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'your secret here' }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.get('/operator', routes.operator);

app.get('/off_line', routes.off_line);

app.get('/room/:id', routes.room);

app.get('/about', routes.about);

app.get('/on_line', routes.on_line);

//values from form
app.post('/on_line', function(req, res){
    var room_id = get_timestamp();
    var collection = db.get('room_collection');
    // Submit to the DB
    collection.insert({
        "name" : req.body.name,
        "phone" : req.body.phone,
        "email": req.body.email,
        "creation_time": room_id,
        "status": 0
    }, function (err, doc) {
        if (err)
            console.log("There was a problem adding the information to the database.");
        else
            res.redirect('/room/'+room_id);
    });
});

app.get('/panel', routes.panel);

app.post('/operator', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    if(username=='lgushiken' && password=='LEOhacom123')
        res.redirect('/panel');
    else
        res.redirect('/operator');
});

var io = require('socket.io').listen(app.listen(port));

//Send msj to an specific room
function send_room_message(data){
    data.creation_time = get_date();
    for(u in users){
        if(data.room_id == users[u].room_id)
            io.sockets.socket(u).emit('message', data);
    }
}

//Send msj to operators
function send_panel_message(data){
    for(u in users){
        if(!users[u].is_client)
            io.sockets.socket(u).emit('add_room', data);
    }
}

function users_in_room(room_id){
    var total = 0;
    var clients = 0;
    for(u in users){
        if(room_id == users[u].room_id){
            total++;
            if(users[u].is_client)
                clients++;
        }
    }
    return [total, clients];
}

function  user_disconnect(room_id){
    if(users_in_room(room_id)[0]==0)
        console.log("enviar correo");
    if(users_in_room(room_id)[1]==0){
        io.sockets.emit('delete_room', {room_id: room_id});
        delete rooms[room_id];
    }
}

//Conexion a Postgres
//var pg = require('pg')
//var conString = "postgres://postgres:postgres@localhost:5432/chat";
//var client = new pg.Client(conString);

function get_timestamp(){
    return parseInt(new Date().getTime());
}

function add_zero(i){
    return (i<10)?"0"+i:i;
}

function get_date(){
    var date = new Date();
    // hours part from the timestamp
    var hours = add_zero(date.getHours());
    // minutes part from the timestamp
    var minutes = add_zero(date.getMinutes());
    // seconds part from the timestamp
    var seconds = add_zero(date.getSeconds());
    return hours + ':' + minutes + ':' + seconds;
}

io.sockets.on('connection', function (socket) {
    socket.on('add_socket_user', function(data){
        //Add user into array
        users[socket.id] = {room_id: data.room_id, is_client: data.is_client};
        //User is client
        if(data.is_client){
            //first time
            if(users_in_room(data.room_id)[1]==0){
                rooms[data.room_id] = {room_id: data.room_id, username: data.username};
                //Notify operator new room
                send_panel_message({room_id: data.room_id, username: data.username});
            }
        }
    });

    var date = new Date();
    var string = (date.getHours() >= 12)?"Buenas tardes, ":"Buenos días, ";
        string += "mi nombre es Leonardo en que puedo ayudarle.";
    //First message load page for clients
    socket.emit('message', { username: 'Soporte', message: string, creation_time: get_date()});

    //Message into specific room
    socket.on('send', function (data) {
        send_room_message(data);
    });

    //Remove user in array
    socket.on('disconnect', function() {
        try{
            var room_id = users[socket.id].room_id;
            delete users[socket.id];
            user_disconnect(room_id);
        }catch (err){
            //console.log(err);
        }
    });
});

console.log("Listening on port " + port);