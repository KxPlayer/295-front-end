import "./css/map.css";
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const UploadedMapPage = () => {
    const [mapInfo, setMapInfo] = useState({"buildingName":"AMC", "floor":"2"});
    const [startPoint, setStartPoint] = useState(null);
    const [settingStartPoint, setSettingStartPoint] = useState(false);
    const [endPoint, setEndPoint] = useState(null);
    const [settingEndPoint, setSettingEndPoint] = useState(false);

    const navigate = useNavigate();

    return (
    <div>
        <input type="button" value="Back" onClick={() => navigate('/upload')} />
        <h1>Building: {mapInfo.buildingName}, Floor: {mapInfo.floor}</h1>
        <div class="mapBox" style={{position:"relative"}} onClick={(e) => {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            if(settingStartPoint){
                setStartPoint([x, y]);
            }else if(settingEndPoint){
                setEndPoint([x, y]);
            }
            }}>
                <svg style={{position:"absolute", left:0, top:0, width:"100%", height:"100%", pointerEvents: "none"}}>
                {startPoint && <p>SP - X = {startPoint[0]} Y = {startPoint[1]}</p> && <circle id="circle1" cx={startPoint[0]} cy={startPoint[1]} r="4" style={{"fill":"green"}} />}
                {endPoint && <p>EP - X = {endPoint[0]} Y = {endPoint[1]}</p> && <circle id="circle1" cx={endPoint[0]} cy={endPoint[1]} r="4" style={{"fill":"red"}} />}
                </svg>  
            
        </div>
        
        <div>
            <input class="setter" type="button" value="Set Start" onClick={() => {console.log("set start"); setSettingStartPoint(true); setSettingEndPoint(false);}} />
            <input class="setter" type="button" value="Set End" onClick={() => {console.log("set end"); setSettingStartPoint(false); setSettingEndPoint(true);}} />
            <input class="path" type="button" value="Find Path" onClick={() => {console.log("find path");}} />
            <input class="reset" type="button" value="Reset Start/End" onClick={() => {console.log("reset start/end"); setSettingStartPoint(false); setSettingEndPoint(false); setStartPoint(null); setEndPoint(null); }} />
            <input class="saved" type="button" value="Saved Maps" onClick={() => {navigate('/savedBuildings', {state:{previous:'/uploadedMap'}})}} />
            <input class="saved" type="button" value="Save Map" onClick={() => {console.log("save map");}} />
        </div>
    </div>);
};

export default UploadedMapPage;

