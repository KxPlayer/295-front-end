import "./css/acctSubmit.css";
import React from 'react';
import { useNavigate } from 'react-router-dom';
//need to handle click for submission
const LoginPage = () => {

    const navigate = useNavigate();
    
    return <div>
        <input type="button" value="Back" onClick={() => {navigate('/');}} />
        <h1>LOGIN</h1> 
        <div>
        <span>Username: </span>
        <input onChange={ev => console.log(ev.target.value)}/>
        </div>
        <div>
        <span>Password: </span>
        <input onChange={ev => console.log(ev.target.value)}/>
        </div>
        <div>
        <input class="login" type="button" value="Submit" onClick={() => {navigate('/');}} />
        </div> 
    </div>
};

export default LoginPage;

