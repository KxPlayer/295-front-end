import "./css/map.css";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// need to get the relative location of the rooms to pass to the backend
// add loading message after the user clicks find path
// add boxes to highlight selected rooms -> start and end points, remove the circles
// remove setting start and end points

const UploadedMapPage = () => {
    const [image, setImage] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [settingStartPoint, setSettingStartPoint] = useState(false);
    const [endPoint, setEndPoint] = useState(null);
    const [settingEndPoint, setSettingEndPoint] = useState(false);
    const [imageSize, setImageSize] = useState({"width":0, "height":0});
    const [originalImageSize, setOriginalImageSize] = useState({"width":0, "height":0});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadImage();
    }, []);

    const loadImage = async () => {
        try{
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/image/' + sessionStorage.getItem("uploaded_image_id"),{
                headers:{
                    'Authorization':token
                }
            });
            setImage(response.data.image);
            console.log(response.data.image);
        }catch(err){
            console.error(err);
        }
    }

    const handleImageLoad = () => {
        let img = document.getElementById('map'); 
        setImageSize({"width":img.width, "height":img.height});
        setOriginalImageSize({"width":img.naturalWidth, "height":img.naturalHeight});
    };

    const updateDisplayedImage = (url) => {
        let img = document.getElementById('map');
        img.src = url;
    }

    const handleSelectStart = (event) => {
        console.log("Start selected" + event.target.value);
    }

    const handleSelectEnd = (event) => {
        console.log("End selected" + event.target.value);
    }

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
                "s3_image_url": image.url
            },{
                headers:{
                    'Authorization':token
                }
            });

            updateDisplayedImage(response.data.path_image_url)
        }catch(err){
            console.error(err);
        }
    }

    while(image == null){
        return <h1>LOADING UPLOADED IMAGE...</h1>
    }

    return (
    <div>
        <input type="button" value="Back" onClick={() => navigate('/upload')} />
        
        <h1>Building: {image.building.name}, Floor: {image.floor}</h1>
        <div>
        <div>
            <select onChange={handleSelectStart}>
                <option value="">Select a starting room</option>
                {image.anchors.map(anchor => {
                    if(anchor.classType === 'classroom' && anchor.tags.length > 0){
                        return <option value={anchor.room}>{anchor.tags.join('')}</option>;
                    }

                    return;
                })}
            </select>
            <select onChange={handleSelectEnd}>
                <option value="">Select a destination room</option>
                {image.anchors.map(anchor => {
                    if(anchor.classType === 'classroom' && anchor.tags.length > 0){
                        return <option value={anchor.room}>{anchor.tags.join('')}</option>;
                    }
                    return;
                })}
            </select>
        </div>

        <div className="mapBox" style={{position:"relative"}} onClick={(e) => {
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

            <img id="map" alt="A map" src={image.url} style={{width:"50%"}} onLoad={handleImageLoad}/>

            <svg style={{position:"absolute", left:"25%", top:0, width:"50%", height:"100%", pointerEvents: "none"}}>
            {startPoint && <circle id="circle1" cx={startPoint[0] * imageSize.width} cy={startPoint[1] * imageSize.height} r="4" style={{"fill":"green"}} />}
            {endPoint && <circle id="circle1" cx={endPoint[0] * imageSize.width} cy={endPoint[1] * imageSize.height} r="4" style={{"fill":"red"}} />}
            </svg>  
            
        </div>
        </div>
        <div>
            <input className="setter" type="button" value="Set Start" onClick={() => {setSettingStartPoint(true); setSettingEndPoint(false);}} />
            <input className="setter" type="button" value="Set End" onClick={() => {setSettingStartPoint(false); setSettingEndPoint(true);}} />
            <input className="path" type="button" value="Find Path" onClick={() => {handleFindPath(); setSettingStartPoint(false); setSettingEndPoint(false);}} />
            <input className="reset" type="button" value="Reset Start & End" onClick={() => {setSettingStartPoint(false); setSettingEndPoint(false); setStartPoint(null); setEndPoint(null); updateDisplayedImage(image.url);}} />
            <input className="saved" type="button" value="Saved Maps" onClick={() => {navigate('/savedBuildings', {state:{previous:'/uploadedMap'}})}} />
        </div>
    </div>);

};

export default UploadedMapPage;

