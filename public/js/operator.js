/**
 * Created by Samuel on 28/08/2014.
 */
$(document).ready(function(){
    //Clear inputs
    $("input[type='text']").val('');
    $("input[type='password']").val('');

    $("#enter_chat").click(function(e){
        e.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        var validation = "";
        //Validation
        if(username=="" || password==""){
            if(username=="")
                validation += "Debe ingresar un usuario";
            if(password=="")
                validation += "\r\nDebe ingresar una contraseña";
            alert(validation);
        }else{
            // saving data into local storage
            localStorage.setItem('user', JSON.stringify({
                'is_client': false,
                'name': 'Soporte'
            }));
            $( "#frm_enter_chat" ).submit();
        }
    });
});