import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleUser, updateSingleUser } from '../store/singleUserStore';

function Profile() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleUser(id));
  }, [dispatch, id]);

  const answers = Array.isArray(user.answers) ? user.answers : [];

  const totalStats = answers.reduce(
    (acc, answer) => {
      acc.totalStrikes += answer.strikes;
      if (answer.correct) acc.correctCount += 1;
      else acc.incorrectCount += 1;
      return acc;
    },
    { totalStrikes: 0, correctCount: 0, incorrectCount: 0 }
  );

  const { totalStrikes, correctCount: totalCorrect, incorrectCount: totalIncorrect } = totalStats;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
      const uploadResponse = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (uploadResponse.ok) {
        const responseData = await uploadResponse.json();
        dispatch(updateSingleUser({ id, image: responseData.imageUrl }));
        alert('Photo uploaded and profile updated successfully');
        setNewPhoto(false);
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
  };

  return (
    <div className="profile-container">
      <h1 className="profile-heading">{user.username}'s Profile</h1>

      {user.image && (
        <div className="user-image" style={{ backgroundImage: `url('${user.image}')` }}></div>
      )}

      <div className="profile-info">
        <div><b>Email:</b> {user.email || 'N/A'}</div>
        <div><b>Total Wins!!</b> {totalCorrect}</div>
        <div><b>Total Losses:</b> {totalIncorrect}</div>
        <div><b>Total Strikes:</b> {totalStrikes}</div>
      </div>

      <button className="btn btn-primary change-password-btn" onClick={handlePassword}>Change Password</button>

      {newPhoto ? (
        <div className="photo-upload-section">
          <input type="file" onChange={handleFileChange} />
          <button className="btn btn-success upload-btn" onClick={handleUpload}>Upload Photo</button>
          {previewUrl && <img src={previewUrl} alt="Preview" className="photo-preview" />}
        </div>
      ) : (
        <button className="btn btn-secondary change-photo-btn" onClick={() => setNewPhoto(true)}>Change Photo</button>
      )}
    </div>
  );
}

export default Profile;
