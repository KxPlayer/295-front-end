import "./css/upload.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//need to check for file type -> image (png, jpg, ???) and change upload button to something better

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [building, setBuilding] = useState('');
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

    const handleFileUpload = () => {
        if (file) {
          // Create a FormData object to send the file
          const formData = new FormData();
          formData.append('file', file);
          console.log("Uploaded!");
          navigate('/uploadedMap');
          /* Send the file to your server using fetch or axios
          // Example using fetch:
          fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then((response) => {
              // Handle the response from the server
            })
            .catch((error) => {
              // Handle errors
            });*/
        }
      };

      return (
        <div>
          <input type="button" value="Back" onClick={() => {navigate('/')}} />
          <p>DESCRIPTION</p>
          <div>
            <span>Building name: </span>
            <input onChange={ev => console.log(ev.target.value)}/>
            <span> </span>
            <span>Floor number: </span>
            <input style={{width:50}}type="number" onChange={ev => console.log(ev.target.value)} />
          </div>
          <br></br>
          <div>
            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
            <br></br>
            {file && 
<img width={"60%"}
              src={URL.createObjectURL(file)}
            />
            }
            <br></br>
            <input class="upload" type="button" value="Submit" onClick={() => {handleFileUpload()}} />
          </div>
        </div>
      );
};

export default UploadPage;

