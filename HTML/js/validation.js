// validation returns a boolean value
function validation() {
    var error = document.getElementById("Error-Message");
    if ((document.forms["welcome"]["Password"].value=="") ||  (document.forms["welcome"]["Username"].value==="")) {
        error.innerHTML="Both Fields need be filled in";
        return false;
    } else if (document.forms["welcome"]["Username"].value.length > 20) {
        error.innerHTML="Username needs to be less than 20 characters";
        return false;
    } else if (document.forms["welcome"]["Password"].value.length > 20) {
        error.innerHTML="Password needs to be less than 20 characters";
        return false; 
    }
    return true;   
}