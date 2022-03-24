function validation() {
    var error = document.getElementById("Error-Message");
    console.log(error)
    if ((document.forms["welcome"]["Roomname"].value=="") ||  (document.forms["welcome"]["Username"].value==="")) {
        error.innerHTML="Both Forms need be filled in";
        return false;
    } else if (document.forms["welcome"]["Roomname"].value.length > 20) {
        console.log("erer")
        error.innerHTML="Room-name needs to be less than 20 characters";
        return false;
    } else if (document.forms["welcome"]["Username"].value.length > 20) {
        error.innerHTML="Username needs to be less than 20 characters";
        return false;
    }   
    return true;   
}