import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchSingleUser } from '../store/singleUserStore'
import { fetchAnswers } from '../store/allAnswersStore'
import { updateSingleUser } from '../store/singleUserStore'



function Profile() {
  const dispatch = useDispatch()
  let history = useHistory();
  const {id} = useSelector((state) => state.auth )
  const user = useSelector((state) => state.singleUser )
  // const answers = useSelector((state) => state.allAnswers )
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);



  useEffect(() => {
    dispatch(fetchSingleUser(id))
    // Safe to add dispatch to the dependencies array
  }, [dispatch,])

  useEffect(() => {
    dispatch(fetchAnswers())
    // Safe to add dispatch to the dependencies array
  }, [dispatch,])


console.log("users", user)

const answers = Array.isArray(user.answers) ? user.answers : [];

const totalStats = answers.reduce(
  (acc, answer) => {
    // Add up strikes
    acc.totalStrikes += answer.strikes;

    // Count correct and incorrect answers
    if (answer.correct) {
      acc.correctCount += 1;
    } else {
      acc.incorrectCount += 1;
    }

    return acc;
  },
  { totalStrikes: 0, correctCount: 0, incorrectCount: 0 }
);

// Access the results
const totalStrikes = totalStats.totalStrikes;
const totalCorrect = totalStats.correctCount;
const totalIncorrect = totalStats.incorrectCount;


const imageUrl = user.image

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Set the URL for preview
  }
};


const handleUpload = async () => {
  if (!selectedFile) {
    alert('Please select a file to upload');
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    // Upload the photo to your server
    const uploadResponse = await fetch(`/api/users/${user.id}`, {
      method: 'PUT', // Change this to PUT
      body: formData,
    });

    if (uploadResponse.ok) {
      const responseData = await uploadResponse.json();
      // Assuming the server response contains the URL of the uploaded image
      dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
      alert('Photo uploaded and profile updated successfully');
      setNewPhoto(false)
    } else {
      alert('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error);
    alert('Upload failed');
  }
};

const handlePassword = () => {
  history.push('/password');
}


  return (
    <div className="text-center">
    <h1 className="profile rounded text-center add" style={{ marginBottom: "15px", marginTop: "25px",  marginLeft: "auto", marginRight: "auto", width: "35%" }}><b>{user.userName}'s Profile</b></h1>

    {user.image && (
    <div   >
       <div className="user-image-container" style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: 'auto',
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '3px solid black'
            }}> </div>
    </div>
  )}
    <div style={{fontSize:"25px"}} >
    <div><b> {user.email ? user.email : 0} </b></div>
    <div><b>Total Wins:</b> {user.answers ? totalCorrect : 0}</div>
    <div><b>Total Loses:</b> {user.answers ? totalIncorrect : 0}</div>
    <div><b>Total Strikes:</b> {user.answers ? totalStrikes : 0}</div>
    </div>
     <button className="btn btn-primary" onClick={() => handlePassword()}>Change Password</button>
     {newPhoto ? <div style={{ margin: '20px 0' }} >
        <input  type="file" onChange={handleFileChange} />
        <button className="btn btn-success"onClick={handleUpload}>Upload Photo</button>
        {previewUrl && (
          <div className="change-photo-button-container">
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '20%', height: 'auto' }} />
          </div>
        )}
      </div> : <div className="change-photo-button-container"><button className="btn btn-secondary" onClick={() => setNewPhoto(true)}>Change Photo</button></div>}

    </div>
  )
}

export default Profile
