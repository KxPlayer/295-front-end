import "./css/acctSubmit.css";
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleClick = async () => {

        if(email === "" || password === ""){
            alert("Please fill out all fields.");
            return;
        }
        
        if(!email.includes('@')){
            alert("Please enter a valid email address.");
            return;
        }

        try{
            const response = await axios.post('http://flask-env.eba-63h3zsef.us-east-2.elasticbeanstalk.com/api/user/login', { email, password });
            const { token } = response.data;
            sessionStorage.setItem('token', token);
            if(token){
                navigate('/');
            }else{
                alert("Login failed. Please check your email and password.");
            }
        }catch(err){
            console.error(err);
            if(err.response && err.response.status === 401){
                alert("Invalid email or password.");
            }
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

