import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnswers } from '../store/allAnswersStore';
import { fetchUsers } from '../store/allUsersStore';
import { fetchMessages, createMessage, deleteMessage } from '../store/allMessagesStore';

function DailyLeaderboard() {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.allAnswers || []);
  const users = useSelector((state) => state.allUsers || []);
  const [showMessageBoard, setShowMessageBoard] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messages = useSelector((state) => state.allMessages);


  // State for selected puzzle number
  const [selectedDate, setSelectedDate] = useState(null);

  console.log("select", selectedDate)


  useEffect(() => {
    dispatch(fetchAnswers());
    dispatch(fetchUsers());
    dispatch(fetchMessages());
  }, [dispatch]);

  // Create a map of userId to username and image for quick lookup
  const usersMap = {};
  users.forEach((user) => {
    usersMap[user.id] = { username: user.username, image: user.image };
  });

  // Extract unique puzzle numbers from answers and sort them
  // const uniqueDates= [...new Set(answers.map((answer) => answer.date))].sort((a, b) => a - b);
  const uniqueDates = [...new Set(answers.map((answer) => answer.date))]
  .sort((a, b) => new Date(a) - new Date(b));


  // Set default selectedNumber to the latest puzzle number if not set
  useEffect(() => {
    if (uniqueDates.length > 0 && selectedDate === null) {
      setSelectedDate(uniqueDates[uniqueDates.length - 1]); // Select the latest puzzle by default
    }
  }, [uniqueDates, selectedDate]);

  // Filter answers for the selected puzzle number
  const filteredAnswers = answers.filter((answer) => answer.date === selectedDate);

  // Sort users with fewest number of strikes at the top
  const leaderboard = filteredAnswers
    .map((answer) => ({
      userId: answer.userId,
      username: usersMap[answer.userId]?.username || 'Unknown',
      image: usersMap[answer.userId]?.image || '',
      strikes: answer.strikes,
      correct: answer.correct,
    }))
    .sort((a, b) => a.strikes - b.strikes);

  // Add rank to leaderboard entries
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  const handleToggleMessageBoard = () => {
    setShowMessageBoard(!showMessageBoard);
  };

  const handlePostMessage = () => {
    if (newMessage.trim()) {
      dispatch(createMessage({ content: newMessage, userId: currentUserId, groupId }));
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (id) => {
    dispatch(deleteMessage(id));
  };

  // Render the leaderboard
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">Leaderboard for Puzzle {selectedDate}</h2>

      {/* Puzzle Number Selection Dropdown */}
      <div className="number-selection">
        <label htmlFor="number-select">Select Date: </label>
        <select
          id="number-select"
          value={selectedDate|| ''}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {uniqueDates.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>

      {leaderboard.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Strikes</th>
              <th>Correct</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr key={user.userId}>
                <td style={{ textAlign: 'center' }}>{user.rank}</td>
                <td>
                  <div className="user-info">
                    {user.image && (
                      <img src={user.image} alt={user.username} className="user-img" />
                    )}
                    <span className="username">{user.username}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{user.strikes}</td>
                <td style={{ textAlign: 'center' }}>{user.correct ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-guesses">No answers have been submitted for this puzzle.</p>
      )}
         <div className="group-detail-message-board-toggle-container">
                {/* Message Board Toggle Button */}
                <button
                  onClick={handleToggleMessageBoard}
                  className="group-detail-message-board-toggle-button"
                >
                  {showMessageBoard ? 'Hide Message Board' : 'Show Message Board'}
                </button>
              </div>
              {/* Conditional Rendering of Message Board */}
              {showMessageBoard && (
                <div className="group-detail-message-board-container">
                  <h3 className="group-detail-message-board-title">Message Board</h3>
                  {messages.map((message) => (
  <div key={message.id} className="message-item">
    <div className="message-content">
      {/* User Image and Username */}
      {message.user ? (
        <div className="user-info">
          {message.user.image ? (
            <img
              src={message.user.image}
              alt={`${message.user.username}'s avatar`}
              className="message-user-image"
            />
          ) : (
            <div className="message-placeholder-image">
              {message.user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="message-username">{message.user.username}</p>
        </div>
      ) : (
        <div className="user-info">
          <div className="message-placeholder-image">N</div>
          <p className="message-username">New Post</p>
        </div>
      )}

      {/* Message Bubble */}
      <div className="message-bubble">
        <p className="message-text">{message.content}</p>
      </div>
    </div>
    {/* Delete Button */}
    {message.userId === currentUserId && (
      <button
        onClick={() => handleDeleteMessage(message.id)}
        className="message-delete-button"
      >
        Delete
      </button>
    )}
    </div>
  ))}
  </div>
              )}
  </div>
  )
}

export default DailyLeaderboard;
