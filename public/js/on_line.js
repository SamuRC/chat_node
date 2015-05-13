/**
 * Created by samurc on 02/03/14.
 */
$(document).ready(function(){
    //Clear inputs
    $("input[type='text']").val('');

    $("#enter_chat").click(function(e){
        e.preventDefault();
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var validation = "";
        //Validation
        if(name=="" || phone=="" || email==""){
            if(name=="")
                validation += "Debe ingresar un nombre";
            if(email=="")
                validation += "\r\nDebe ingresar un email";
            if(phone=="")
                validation += "\r\nDebe ingresar un teléfono";
            alert(validation);
        }else{
            // saving data into local storage
            localStorage.setItem('user', JSON.stringify({
                'is_client': true,
                'name': name,
                'email': email,
                'phone': phone
            }));
            $( "#frm_enter_chat" ).submit();
        }
    });
});