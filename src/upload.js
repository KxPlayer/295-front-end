import "./css/upload.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//need to check for file type -> image (png, jpg, ???) and change upload button to something better
//need to pass info from upload page to uploaded map
//floor is not used, need to talk to daniel about it

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [building, setBuilding] = useState('');
    const [buildingId, setBuildingId] = useState(-1);
    const [floor, setFloor] = useState(0);

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        console.log("File changed!");
        setFile(event.target.files[0]);
        console.log(file);
        /*var reader = new FileReader();
        reader.onload = (
          function(theFile) { 
            return function(e) { 
              console.log(file.name);
              document.getElementById('list').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="50" />'].join('"'); 
            }; 
		})(file);
	reader.readAsDataURL(file);*/
    };

    const handleBuildingUpload = async () => {
      try{
        const token = localStorage.getItem('token'); // or sessionStorage.getItem('token'); using local for now

        const response = await axios.post('http://localhost:8080/api/building', { building }, 
        { 
          headers:{
            'Authorization':token
          } 
        });

        console.log(response.data);
        // check if building upload was successful
        // need to store building id from response
        setBuildingId(response.data.id);
        console.log(buildingId);
    }catch(err){
        console.error(err);
    }
    };

    const handleFileUpload = async () => {
      // need to wait for building upload to finish
        if (file) {
          // Create a FormData object to send the file
          const formData = new FormData();
          formData.append('file', file);
          formData.append('building_id', buildingId);
          formData.append('type', 'raw');
          formData.append('floor', floor);
          console.log("Uploaded!");
          //navigate('/uploadedMap'); -> only happens if upload is successful
          
          try {
            const token = localStorage.getItem('token'); // or sessionStorage.getItem('token');

            const response = await axios.post('http://localhost:8080/api/upload_image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token,
                },
            });
          } catch (error) {
              console.error('Error uploading file:', error);
          }
        }
      };

      return (
        <div>
          <input type="button" value="Back" onClick={() => {navigate('/')}} />
          <p>DESCRIPTION</p>
          <div>
            <span>Building name: </span>
            <input onChange={ev => setBuilding(ev.target.value)}/>
            <span> </span>
            <span>Floor number: </span>
            <input style={{width:50}}type="number" onChange={ev => setFloor(ev.target.value)} />
          </div>
          <br></br>
          <div>
            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
            <br></br>
            {file && <img width={"60%"}
              src={URL.createObjectURL(file)}
            />
            }
            <br></br>
            <input class="upload" type="button" value="Submit" onClick={() => {handleBuildingUpload(); handleFileUpload();}} />
          </div>
        </div>
      );
};

export default UploadPage;

