import "./css/map.css";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

// copy the uploaded map page, honestly

const SavedMapPage = () => {
    const [mapInfo, setMapInfo] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [settingStartPoint, setSettingStartPoint] = useState(false);
    const [endPoint, setEndPoint] = useState(null);
    const [settingEndPoint, setSettingEndPoint] = useState(false);
    const [imageSize, setImageSize] = useState({"width":0, "height":0});
    const [originalImageSize, setOriginalImageSize] = useState({"width":0, "height":0});

    const navigate = useNavigate();
    const location = useLocation();

    let previous = '/';

    useEffect(() => {
        // loadRooms();
        getMapInfo();
    }, [location.state])

    const getMapInfo = async () => {
        console.log("getting map info");
        try{
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/image/' + location.state.mapId, {
                headers: {
                    'Authorization': token
                }
            });
            setMapInfo(response.data.image);
            console.log(response.data);
        }catch(err){
            console.error(err);
        }
    };

    const handleImageLoad = () => {
        let img = document.getElementById('map'); 
        setImageSize({"width":img.width, "height":img.height});
        setOriginalImageSize({"width":img.naturalWidth, "height":img.naturalHeight});
    };

    const updateImage = (url) => {
        let img = document.getElementById('map');
        img.src = url;
    };

    const handleSelectStart = (event) => {
        console.log("Start selected" + event.target.value);
    };

    const handleSelectEnd = (event) => {
        console.log("End selected" + event.target.value);
    };

    const handleFindPath = async () => {
        if(!startPoint || !endPoint){
            console.log("Start and end points not set");
            return;
        }

        try{
            const token = sessionStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/calculate_path', 
            { 
                "start_point": [parseInt(startPoint[1] * originalImageSize.height), parseInt(startPoint[0] * originalImageSize.width)],
                "end_point": [parseInt(endPoint[1] * originalImageSize.height), parseInt(endPoint[0] * originalImageSize.width)],
                "s3_image_url": mapInfo.url
            },{
                headers:{
                    'Authorization':token
                }
            });

            updateImage(response.data.path_image_url)
        }catch(err){
            console.error(err);
        }
    };

    if(sessionStorage.getItem('token') == null){
        return <><p>You must be logged in to view this page.</p><a href="/login">Login</a></>;
    }

    if(location.state == null){
        return (<h1>ERROR</h1>);
    }else{
        previous = location.state.previous;
    };

    if(mapInfo == null){
        return <h1>LOADING SAVED MAP...</h1>
    }

    return (
        <div>
            <input type="button" value="Back" onClick={() => navigate("/savedMapsList", {state:{previous:previous, buildingName:location.state.buildingName, buildingId:location.state.buildingId}})} />
            
            <h1>Building: {location.state.buildingName}, Floor: {mapInfo.floor}</h1>
            <div>
            <div>
                <select onChange={handleSelectStart}>
                    <option value="">Select a starting room</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                <select onChange={handleSelectEnd}>
                    <option value="">Select a destination room</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>
    
            <div class="mapBox" style={{position:"relative"}} onClick={(e) => {
                var rect = e.target.getBoundingClientRect();
                var x = Math.max(0, e.clientX - rect.left) / imageSize.width;
                var y = Math.max(0, e.clientY - rect.top) / imageSize.height;
    
                if(settingStartPoint){
                    setStartPoint([x, y]);
                    setSettingStartPoint(false);
                }else if(settingEndPoint){
                    setEndPoint([x, y]);
                    setSettingEndPoint(false);
                }
                
                }}>
    
                <img id="map" alt="A map" src={mapInfo.url} style={{width:"50%"}} onLoad={handleImageLoad}/>
    
                <svg style={{position:"absolute", left:"25%", top:0, width:"50%", height:"100%", pointerEvents: "none"}}>
                {startPoint && <circle id="circle1" cx={startPoint[0] * imageSize.width} cy={startPoint[1] * imageSize.height} r="4" style={{"fill":"green"}} />}
                {endPoint && <circle id="circle1" cx={endPoint[0] * imageSize.width} cy={endPoint[1] * imageSize.height} r="4" style={{"fill":"red"}} />}
                </svg>  
                
            </div>
            </div>
            <div>
                <input class="setter" type="button" value="Set Start" onClick={() => {setSettingStartPoint(true); setSettingEndPoint(false);}} />
                <input class="setter" type="button" value="Set End" onClick={() => {setSettingStartPoint(false); setSettingEndPoint(true);}} />
                <input class="path" type="button" value="Find Path" onClick={() => {handleFindPath(); setSettingStartPoint(false); setSettingEndPoint(false);}} />
                <input class="reset" type="button" value="Reset Start & End" onClick={() => {setSettingStartPoint(false); setSettingEndPoint(false); setStartPoint(null); setEndPoint(null); updateImage(mapInfo.url);}} />
            </div>
        </div>);
};

export default SavedMapPage;

