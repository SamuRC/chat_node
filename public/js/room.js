window.onload = function() {
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = $("#msj_text");
    var sendButton = $("#send_msj");
    var historial = document.getElementById("msj_historial");
    var container = document.getElementById("msj_container");
    var room_id = parseInt(window.location.pathname.split( '/' )[2]);

    var data = JSON.parse( localStorage.getItem('user'));
    socket.emit("add_socket_user", {"room_id": room_id, "is_client": data.is_client, "username": data.name});

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<p><b>' + '['+messages[i].creation_time + '] ';
                html += (messages[i].username ? messages[i].username : 'Soporte') + ': </b>';
                html += messages[i].message + '<p/>';
            }
            historial.innerHTML = html;
            container.scrollTop = container.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.click(function(){
        var text = field.val();
        if (text!="")
            socket.emit('send', { message: text, username: data.name, room_id: room_id });
        field.val('');
    });

    field.bind("enterKey",function(e){
        var text = field.val();
        if (text!="")
            socket.emit('send', { message: text, username: data.name, room_id: room_id });
        field.val('');
    });

    field.keyup(function(e){
        if(e.keyCode == 13)
            $(this).trigger("enterKey");
    });

}