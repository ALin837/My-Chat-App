async function register(event) {

    
    var error = document.getElementById("Error-Message");
    if ((document.forms["welcome"]["Password"].value=="") ||  (document.forms["welcome"]["Username"].value==="")) {
        error.innerHTML="Both Fields need be filled in";
        return false;
    } else if (document.forms["welcome"]["Username"].value.length > 20) {
        error.innerHTML="Username needs to be less than 20 characters";
        return false;
    }  else if (document.forms["welcome"]["Password"].value.length > 20) {
        error.innerHTML="Password needs to be less than 20 characters";
        return false;
    }
    return true;
    /*
        
    const username = document.querySelector('#Username').value
    const password = document.querySelector('#Password').value
    axios.post('/register/user',
    {
        username: username,
        password: password
    })
    .then((response)=> {
        console.log("Successful")
        return true;
    })
    .catch((error) => {
        console.log(error);
        return false;
    });
    // non error related to password and username fields// Must check database 

    return result;  
    */
}

