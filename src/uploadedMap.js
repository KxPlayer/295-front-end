import "./css/map.css";
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const UploadedMapPage = () => {
    const [mapInfo, setMapInfo] = useState({"buildingName":"AMC", "floor":"2"});
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

    const navigate = useNavigate();

    return (
    <div>
        <input type="button" value="Back" onClick={() => navigate('/upload')} />
        <h1>Building: {mapInfo.buildingName}, Floor: {mapInfo.floor}</h1>
        <div class="mapBox">
            
        </div>
        <div>
            <input class="setter" type="button" value="Set Start" onClick={() => {console.log("set start");}} />
            <input class="setter" type="button" value="Set End" onClick={() => {console.log("set end");}} />
            <input class="path" type="button" value="Find Path" onClick={() => {console.log("find path");}} />
            <input class="reset" type="button" value="Reset Start/End" onClick={() => {console.log("reset start/end");}} />
            <input class="saved" type="button" value="Saved Maps" onClick={() => {navigate('/savedBuildings', {state:{previous:'/uploadedMap'}})}} />
            <input class="saved" type="button" value="Save Map" onClick={() => {console.log("save map");}} />
        </div>
    </div>);
};

export default UploadedMapPage;

