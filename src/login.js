import "./css/acctSubmit.css";
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//need to handle click for submission
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleClick = async () => {
        try{
            const response = await axios.post('http://localhost:8080/api/user/login', { email, password });
            console.log(response.data); // need to save token here, check if exists, else do not redirect to home
            const { token } = response.data;
            // Store the token in localStorage or sessionStorage, use local for now
            localStorage.setItem('token', token);
        }catch(err){
            console.error(err);
        }
    }
    
    return <div>
        <input type="button" value="Back" onClick={() => {navigate('/');}} />
        <h1>LOGIN</h1> 
        <div>
        <span>Email: </span>
        <input onChange={ev => setEmail(ev.target.value)}/>
        </div>
        <div>
        <span>Password: </span>
        <input onChange={ev => setPassword(ev.target.value)}/>
        </div>
        <div>
        <input class="login" type="button" value="Submit" onClick={handleClick} />
        </div> 
    </div>
};

export default LoginPage;

