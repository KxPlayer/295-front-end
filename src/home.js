import "./css/home.css";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();

    return (
    <div>
        <h1>TITLE</h1>
        <p>Description here.</p>
        <input type="button" class="upload" value="Upload a map" onClick={() => {navigate('/upload');}} />
        <br></br>
        <input type="button" class="login" value="Log into account" onClick={() => {navigate('/login');}} />
        <br></br>
        <input type="button" class="register" value="Register an account" onClick={() => {navigate('/register');}} />
        <br></br>
        <input type="button" class="savedmaps" value="See saved maps" onClick={() => {navigate('/savedBuildings', {state:{previous:'/'}})}} />
    </div>);
};

export default HomePage;

