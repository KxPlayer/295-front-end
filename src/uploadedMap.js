import "./css/map.css";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// need to pass floor and building name to this page
// need to setup pathfinding

const UploadedMapPage = () => {
    const [mapInfo, setMapInfo] = useState({"building":"", "floor":NaN});
    const [startPoint, setStartPoint] = useState(null);
    const [settingStartPoint, setSettingStartPoint] = useState(false);
    const [endPoint, setEndPoint] = useState(null);
    const [settingEndPoint, setSettingEndPoint] = useState(false);
    const [imageSize, setImageSize] = useState({"width":0, "height":0});
    const [originalImageSize, setOriginalImageSize] = useState({"width":0, "height":0});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
         setMapInfo(location.state);
    }, [location.state]);

    const handleImageLoad = () => {
        let img = document.getElementById('map'); 
        setImageSize({"width":img.width, "height":img.height});
        setOriginalImageSize({"width":img.naturalWidth, "height":img.naturalHeight});
    };

    const updateImage = (url) => {
        let img = document.getElementById('map');
        img.src = url;
    }

    const handleFindPath = async () => {
        console.log("Finding path");
        // send start and end points to backend
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
                "s3_image_url": sessionStorage.getItem("s3_url")
            },{
                headers:{
                    'Authorization':token
                }
            });

            console.log(response.data);
            updateImage(response.data.path_image_url)
        }catch(err){
            console.error(err);
        }
    }

    return (
    <div>
        <input type="button" value="Back" onClick={() => navigate('/upload')} />
        
        <h1>Building: {sessionStorage.getItem("uploadedBuilding")}, Floor: {sessionStorage.getItem("uploadedFloor")}</h1>

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

            <img id="map" src={sessionStorage.getItem("s3_url")} style={{width:"50%"}} onLoad={handleImageLoad}/>

            <svg style={{position:"absolute", left:"25%", top:0, width:"50%", height:"100%", pointerEvents: "none"}}>
            {startPoint && <circle id="circle1" cx={startPoint[0] * imageSize.width} cy={startPoint[1] * imageSize.height} r="4" style={{"fill":"green"}} />}
            {endPoint && <circle id="circle1" cx={endPoint[0] * imageSize.width} cy={endPoint[1] * imageSize.height} r="4" style={{"fill":"red"}} />}
            </svg>  
            
        </div>
        
        <div>
            <input class="setter" type="button" value="Set Start" onClick={() => {setSettingStartPoint(true); setSettingEndPoint(false);}} />
            <input class="setter" type="button" value="Set End" onClick={() => {setSettingStartPoint(false); setSettingEndPoint(true);}} />
            <input class="path" type="button" value="Find Path" onClick={() => {handleFindPath(); setSettingStartPoint(false); setSettingEndPoint(false);}} />
            <input class="reset" type="button" value="Reset Start & End" onClick={() => {setSettingStartPoint(false); setSettingEndPoint(false); setStartPoint(null); setEndPoint(null); updateImage(sessionStorage.getItem("s3_url"));}} />
            <input class="saved" type="button" value="Saved Maps" onClick={() => {navigate('/savedBuildings', {state:{previous:'/uploadedMap'}})}} />
        </div>
    </div>);
};

export default UploadedMapPage;

