
const form = document.getElementById("login-section")
form.addEventListener("submit", validation)

// validation returns a boolean value
async function validation(e) {
    e.preventDefault();
    var error = document.getElementById("Error-Message");
    var message = ""
    if ((document.forms["welcome"]["Password"].value=="") ||  (document.forms["welcome"]["Username"].value=="")) {
        message="Both Fields need be filled in";
    } else {
        const username = document.querySelector('#Username').value
        const password = document.querySelector('#Password').value
        await axios.post('/api/login/user',
        {
            username: username,
            password: password
        })
        .then((res)=> {
            console.log(res.response.data)
            message=res.response.data;
        })
        .catch((err) => {
            console.log(err.response.data);
            message=err.response.data;
        });
    }
    if (message !== "" || message == null) {
        error.innerHTML = message;
    }
    return true;   
}