import "./css/acctSubmit.css";
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// need message if register failed

const RegistrationPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // should check for valid email, username and password and call before handleClick? in handleClick?
    const checkValidInputs = () => {
        if(email === "" || username === "" || password === ""){
            return false;
        }
        return true;
    }

    const handleClick = async () => {
        try{
            const response = await axios.post('http://localhost:8080/api/user', { email, username, password });
            console.log(response.data);
            // should check for valid registration before redirecting?
            navigate('/home');
        }catch(err){
            console.error(err);
        }
    }

    return <div>
        <input type="button" value="Back" onClick={() => {navigate('/');}} />
        <h1>REGISTER</h1>
        <div>
        <span>Email: </span>
        <input onChange={ev => setEmail(ev.target.value)}/>
        </div>
        <div>
        <span>Username: </span>
        <input onChange={ev => setUsername(ev.target.value)}/>
        </div>
        <div>
        <span>Password: </span>
        <input onChange={ev => setPassword(ev.target.value)}/>
        </div>
        <div>
        <input class="register" type="button" value="Submit" onClick={handleClick} />
        </div> 
    </div>
};

export default RegistrationPage;

