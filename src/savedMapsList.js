import "./css/savedMapsList.css";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const SavedMapsListPage = () => {
    const [maps, setMaps] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    let previous = '/';

    useEffect(() => {
        loadMaps();
    }, []);

    if(location.state == null){
        return (<h1>ERROR</h1>);
    }else{
        previous = location.state.previous;
    }

    if(maps == null){
        return (<h1>LOADING MAPS...</h1>);
    }

    const loadMaps = async () => {
        try{
            const token = sessionStorage.getItem('token');

            const response = await axios.get('http://localhost:8080/api/building/' + location.state.buildingId, {
                headers: {
                    'Authorization': token
                }
            });

            const sortedMaps = response.data.building.images;
            sortedMaps.sort((a, b) => (a.floor > b.floor) ? 1 : -1);
            sortedMaps.forEach(map => {
                if(map.floor < 0){
                    map.floor = "B" + Math.abs(map.floor);
                }
                map.floor = "" + map.floor;
            });
            setMaps(sortedMaps);
        }catch(err){
            console.error(err);
        }   
    }

    const deleteMap = async (imageId) => {
        try{
            const token = sessionStorage.getItem('token');

            await axios.delete('http://localhost:8080/api/image/' + imageId, {
                headers: {
                    'Authorization': token
                },
            });

            loadMaps();
        }catch(err){
            console.error(err);
        }
    }

    while(maps == null){
        return (<h1>Loading...</h1>);
    }

    return (
        <div>
            <input type="button" value="Back" onClick={() => {navigate('/savedBuildings', {state:{previous:previous}})}} />
            <h1>{location.state.buildingName} Maps</h1>
            {maps.map(map => {
                return <div class="box" onClick={() => {navigate('/savedMap', {state:{previous:previous, buildingName:location.state.buildingName, buildingId:location.state.buildingId, mapId:map.id}})}}>
                            <h1>Floor {map.floor}</h1>
                            <input class="delete" type='button' onClick={(event) => {event.stopPropagation(); deleteMap(map.id)}} value="X"/>
                        </div>
            })}
        </div>);

};

export default SavedMapsListPage;

