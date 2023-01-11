import '../styles/login-page.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { Component }  from 'react';
function Register(props) {
    const navigate = useNavigate();
    function handleRegister(e) {
        e.preventDefault();
        var error = document.getElementById("Error-Message");
        if ((document.forms["welcome"]["Password"].value=="") ||  (document.forms["welcome"]["Username"].value=="")) {
            error.innerHTML="Both Fields need be filled in";
        } else if (document.forms["welcome"]["Username"].value.length > 20) {
            error.innerHTML="Username needs to be less than 20 characters";
        }  else if (document.forms["welcome"]["Password"].value.length > 20) {
            error.innerHTML="Password needs to be less than 20 characters";
        } else {
            const username = document.querySelector('#Username').value
            const password = document.querySelector('#Password').value
            const userRegister =  async (username, password, navigate) => {
                try {
                    const response = await axios.post('/api/register/user',
                    {
                        username: username,
                        password: password
                    });
                    if (response.status === 200) {
                      return navigate("/", { replace: true }); // <-- issue imperative redirect
                    }
                } catch (err) {
                    error.innerHTML = err.response.data;
                }
            }
            userRegister(username, password, navigate);
        }
    }

    return (
        <div id="home-login">
            <div className="root" id="home-page">
                <div className="wrap">
                    <div className="sign-in">
                        <section className="sign-in-page">
                            <div className="title-page">
                                <h2>Create Account Page</h2>
                            </div>
                            <div id="Error-Message">
                                    {/*Room-name needs to be less than 20 characters*/}
                                    {/*Username needs to be less than 20 characters */}
                                    {/*Both Forms need be filled in*/}
                            </div>
                            <div className="forms">
                                {/*Values need to be sent to server. Room must be created and the username must be created as a client*/}
                                <form name="welcome" id="register-section" onSubmit = {handleRegister}>
                                <label htmlFor ="Username">Username:</label><br></br>
                                    <input type="text" id="Username" name="Username" placeholder="Please enter a Username"
                                        autoComplete="off"></input><br></br>
                                    <label htmlFor ="Password">Password:</label><br></br>
                                    <input type="password" id="Password" name="Password" placeholder="Please enter a Password"
                                        autoComplete="off"></input> <br></br>
                                    <input type="submit" id="Submit" value="Submit"></input><br></br>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;