import "./css/acctSubmit.css";
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const checkValidInputs = () => {
        if(email === "" || username === "" || password === ""){
            return false;
        }
        return true;
    }

    const handleClick = async () => {
        if(!checkValidInputs()){
            alert("Please fill out all fields.");
            return;
        }

        if(!email.includes('@')){
            alert("Please enter a valid email address.");
            return;
        }

        try{
            setLoading(true);
            const response = await axios.post('http://localhost:8080/api/user', { email, username, password });
            console.log(response.data);
            setLoading(false);
            navigate('/');
        }catch(err){
            setLoading(false);
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
        <input class="register" type="button" value="Submit" onClick={handleClick} disabled={loading}/>
        </div> 
    </div>
};

export default RegistrationPage;

