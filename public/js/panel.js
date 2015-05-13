/**
 * Created by samurc on 02/03/14.
 */
window.onload = function() {
    var socket = io.connect('http://localhost:3700');
    var data = JSON.parse( localStorage.getItem('user'));
    socket.emit("add_socket_user", {"room_id": null, "is_client": data.is_client, "username": data.name});

    var rooms_list = $("#rooms_list");

    socket.on('add_room', function (data) {
        console.log(data);
        if(data.room_id) {
            var html = '<a id="'+data.room_id+'" href="#" class="list-group-item">';
                html += data.username + '</a>';
            rooms_list.append(html);
        } else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('delete_room', function(data){
       if(data.room_id)
            $("#"+data.room_id).remove();
       else
           console.log("There is a problem:", data);
    });

    //Open popup
    rooms_list.on('dblclick', 'a', function(e){
        e.preventDefault();
        var room_id = $(this).prop('id');
        a = window.open('/room/'+room_id,"",
            "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=640, height=550, top=85, left=140");
    });

}
