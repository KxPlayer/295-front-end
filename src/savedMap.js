import "./css/map.css";
import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SavedMapPage = () => {
    const [mapInfo, setMapInfo] = useState({"buildingName":"AMC", "floor":"2"});
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    let previous = '/';

    if(location.state == null){
        return (<h1>ERROR</h1>);
    }else{
        previous = location.state.previous;
    }

    return (
    <div>
        <input type="button" value="Back" onClick={() => navigate("/savedMapsList", {state:{previous:previous}})} />
        <h1>Building: {mapInfo.buildingName}, Floor: {mapInfo.floor}</h1>
        <div class="mapBox">
            
        </div>
        <div>
            <input class="setter" type="button" value="Set Start" onClick={() => {console.log("set start");}} />
            <input class="setter" type="button" value="Set End" onClick={() => {console.log("set end");}} />
            <input class="path" type="button" value="Find Path" onClick={() => {console.log("find path");}} />
            <input class="reset" type="button" value="Reset Start/End" onClick={() => {console.log("reset start/end");}} />
        </div>
    </div>);

};

export default SavedMapPage;

