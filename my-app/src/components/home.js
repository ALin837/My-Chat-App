import '../styles/login-page.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { Component }  from 'react';
function HomePage(props) 
{
    const navigate = useNavigate();
    function handleLogin(e) {
        e.preventDefault();
        var error = document.getElementById("Error-Message");
        if ((document.forms["welcome"]["Password"].value=="") ||  (document.forms["welcome"]["Username"].value=="")) {
            error.innerHTML="Both Fields need be filled in";
        } else {
            const username = document.querySelector('#Username').value
            const password = document.querySelector('#Password').value
            const userRegister =  async (username, password, navigate) => {
                try {
                    const response = await axios.post('/api/login/user',
                    {
                        username: username,
                        password: password
                    });
                    console.log(response)
                    if (response.status === 200) {
                      return navigate("/chat", { replace: true }); // <-- issue imperative redirect
                    }
                } catch (err) {
                    error.innerHTML =err.response.data;
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
                            <h2>Welcome to My-Chat-App</h2>
                        </div>
                        <div id="Error-Message">
                            {/*Room-name needs to be less than 20 characters*/}
                            {/*Username needs to be less than 20 characters */}
                            {/*Both Forms need be filled in*/}
                        </div>
                        <div className="forms">
                            {/*Values need to be sent to server. Room must be created and the username must be created as a client*/}
                            <form name="welcome" action="chat_page.html" id="login-section" onSubmit={handleLogin}>
                            <label htmlFor ="Username">Username:</label><br></br>
                                <input type="text" id="Username" name="Username" placeholder="Please enter a Username"
                                    autoComplete="off"></input><br></br>
                                <label htmlFor ="Password">Password:</label><br></br>
                                <input type="text" id="Password" name="Password" placeholder="Please enter a Password"
                                    autoComplete="off"></input> <br></br>
                                <input type="submit" id="Submit" value="Login"></input><br></br>
                            </form>
                        </div>
                    </section>
                </div>
                <div className="register" id="register">
                <p> Don't have an account? <Link to={"/register"}><span style={{color: "rgb(0, 149, 246)"}}>Sign
                            up</span></Link></p>
                </div>
            </div>
        </div>
    </div>
    );
}


export default HomePage;