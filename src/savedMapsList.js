import "./css/savedMapsList.css";
import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
//need to sort floor numbers, < 0 means adding a B in front of it
//some sort of check to make sure there are values
const SavedMapsListPage = () => {
    const [maps, setMaps] = useState([{"buildingName":"AMC", "floorNumber":1},
                                        {"buildingName":"AMC", "floorNumber":-2}, 
                                        {"buildingName":"AMC", "floorNumber":3}]);

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
            <input type="button" value="Back" onClick={() => {navigate('/savedBuildings', {state:{previous:previous}})}} />
            <h1>{maps[0].buildingName} MAPS</h1>
            {maps.map(map => {
                return <div class="box" onClick={() => {navigate('/savedMap', {state:{previous:previous}})}}>
                            <h1>Floor {map.floorNumber}</h1>
                            <input class="delete" type='button' onClick={(event) => {event.stopPropagation(); console.log("Deleting " + map.buildingName + ", floor " + map.floorNumber);}} value="X"/>
                        </div>
            })}
        </div>);

};

export default SavedMapsListPage;

