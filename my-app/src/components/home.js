import '../styles/login-page.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import useAuth from '../hooks/useAuth';
import logo from '../images/cover.png';
const baseURLinstance = process.env.REACT_APP_API_URL //|| "http://localhost:9000";

function HomePage(props) 
{
    axios.defaults.withCredentials = true;
    const {setAuth} = useAuth();
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
                    const response = await axios.post(baseURLinstance + '/api/login/user',
                    {
                        username: username,
                        password: password
                    });
                    if (response.status === 200) {
                        const accessToken = response.data.token;
                        const userId = response.data.userId;
                        setAuth({username, password, accessToken, userId})
                        return navigate("/chat", { replace: true }); // <-- issue imperative redirect
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
                            <img id = "image" src = {logo}></img>
                             <p className="login-title">Log in to MyChatApp</p>
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
                                <input type="text" id="Username" name="Username" placeholder="Username"
                                    autoComplete="off"></input><br></br>
                                <label htmlFor ="Password">Password:</label><br></br>
                                <input type="password" id="Password" name="Password" placeholder="Password"
                                    autoComplete="off"></input> <br></br>
                                <input type="submit" id="Submit" value="Log in"></input><br></br>
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