import "./css/savedBuildings.css";
import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
//need to sort building names and include # of floors
const SavedBuildingsPage = () => {
    const [buildings, setBuildings] = useState([{"buildingName":"AMC"},
                                                {"buildingName":"DMH"}, 
                                                {"buildingName":"ENGR"}]);

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
            <input type="button" value="Back" onClick={() => {navigate(previous)}} />
            <h1>BUILDINGS</h1>
            {buildings.map(building => {
                return <div class="box" onClick={() => navigate('/savedMapsList', {state:{previous:previous}})}>
                            <h1>{building.buildingName}</h1>
                            <input class="delete" type='button' onClick={(event) => {event.stopPropagation(); console.log("Deleting " + building.buildingName)}} value="X"/>
                        </div>
            })}
        </div>);

};

export default SavedBuildingsPage;

