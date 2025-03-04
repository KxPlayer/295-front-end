import "./css/upload.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//change upload button to something better
//need to pass info from upload page to uploaded map
//floor is not used, need to talk to daniel about it
//need to add loading message since this takes like 20 seconds

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [building, setBuilding] = useState('');
    const [floor, setFloor] = useState(null);
    const [validSubmit, setValidSubmit] = useState(false);

    const navigate = useNavigate();

    const updateValidSubmit = (building, floor, file) => {
      setValidSubmit(building.length > 0 && floor != null && file);
    }

    const updateBuilding = (value) => {
      setBuilding(value);
      updateValidSubmit(value, floor, file);  
    }

    const updateFloor = (value) => {
      setFloor(value); 
      updateValidSubmit(building, value, file);  
    }

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
      updateValidSubmit(building, floor, event.target.files[0]);  
    }

    const handleBuildingUpload = async () => {
      console.log("Trying to upload building");
      try{
        const token = sessionStorage.getItem('token');

        const response = await axios.post('http://localhost:8080/api/building', 
        { 
          "name": building 
        }, 
        { 
          headers:{
            'Authorization':token
          } 
        });

        console.log(response.data);
        return response.data.building_id;
    }catch(err){
        console.error(err);
    }
    };

    const handleFileUpload = async (buildingId) => {
      // need to wait for building upload to finish
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('building_id', buildingId);
          formData.append('type', 'raw');
          formData.append('floor', floor);

          try {
            
            const token = sessionStorage.getItem('token');

            const response = await axios.post('http://localhost:8080/api/upload_image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token,
                },
            });

            console.log(response.data);
            sessionStorage.setItem('s3_url', response.data.s3_url);
            sessionStorage.setItem('uploadedBuilding', building);
            sessionStorage.setItem('uploadedFloor', floor);
            navigate('/uploadedMap');

          } catch (error) {
              console.error('Error uploading file:', error);
          }
        }
      };

      const handleSubmit = async () => {
        try{
          const buildingId = await handleBuildingUpload();
          await handleFileUpload(buildingId);
        }catch(err){
          console.error(err);
        }
      };

      return (
        <div>
          <input type="button" value="Back" onClick={() => {navigate('/')}} />
          <p>DESCRIPTION</p>
          <div>
            <span>Building name: </span>
            <input onChange={ev => updateBuilding(ev.target.value)}/>
            <span> </span>
            <span>Floor number: </span>
            <input style={{width:50}}type="number" onChange={ev => updateFloor(ev.target.value)} />
          </div>
          <br></br>
          <div>
            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
            <br></br>
            <input class="upload" type="button" value="Submit" onClick={handleSubmit} disabled={!validSubmit}/>
          </div>
        </div>
      );
};

export default UploadPage;

