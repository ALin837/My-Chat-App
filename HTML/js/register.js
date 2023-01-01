
const form = document.getElementById("register-section")
form.addEventListener("submit", register)

function register(e) {
    e.preventDefault();
    var error = document.getElementById("Error-Message");
    var message = ""
    if ((document.forms["welcome"]["Password"].value=="") ||  (document.forms["welcome"]["Username"].value=="")) {
        message="Both Fields need be filled in";
    } else if (document.forms["welcome"]["Username"].value.length > 20) {
        message="Username needs to be less than 20 characters";
    }  else if (document.forms["welcome"]["Password"].value.length > 20) {
        message="Password needs to be less than 20 characters";
    } else {
        const username = document.querySelector('#Username').value
        const password = document.querySelector('#Password').value
        axios.post('/register/user',
        {
            username: username,
            password: password
        })
        .then((response)=> {
            window.location.href = '../'
        })
        .catch((err) => {
            console.log(err.response.data);
            message=err.response.data;
            if (message !== "" || message == null) {
                error.innerHTML = message;
            }
        });
    }
    if (message !== "" || message == null) {
        error.innerHTML = message;
    }
}

