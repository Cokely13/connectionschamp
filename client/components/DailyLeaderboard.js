import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnswers } from '../store/allAnswersStore';
import { fetchUsers } from '../store/allUsersStore';
import { fetchMessages, createMessage, deleteMessage } from '../store/allMessagesStore';

function DailyLeaderboard() {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.allAnswers || []);
  const users = useSelector((state) => state.allUsers || []);
  const messages = useSelector((state) => state.allMessages || []);
  const currentUserId = useSelector((state) => state.auth.id);
  const [showMessageBoard, setShowMessageBoard] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(fetchAnswers());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Fetch messages when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchMessages(filteredAnswers[0].number));
      setShowMessageBoard(false); // Close message board when date changes
    }
  }, [dispatch, selectedDate]);

  // Create a map of userId to username and image for quick lookup
  const usersMap = {};
  users.forEach((user) => {
    usersMap[user.id] = { username: user.username, image: user.image };
  });

  // Extract unique dates from answers and sort them
  const uniqueDates = [...new Set(answers.map((answer) => answer.date))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Set default selectedDate to the latest date if not set
  useEffect(() => {
    if (uniqueDates.length > 0 && selectedDate === null) {
      setSelectedDate(uniqueDates[uniqueDates.length - 1]); // Select the latest date by default
    }
  }, [uniqueDates, selectedDate]);

  // Filter answers for the selected date
  const filteredAnswers = answers.filter((answer) => answer.date === selectedDate);

  console.log("filte", filteredAnswers)

  console.log("selected", selectedDate)

  // Generate the leaderboard
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
      dispatch(
        createMessage({
          content: newMessage,
          puzzleNumber: filteredAnswers[0].number,
          userId: currentUserId, // Assuming you need to pass userId
        })
      );
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (currentUserId) => {
    dispatch(deleteMessage(currentUserId));
  };

  // Render the component
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">Leaderboard for {selectedDate}</h2>

      {/* Date Selection Dropdown */}
      <div className="number-selection">
        <label htmlFor="date-select">Select Date: </label>
        <select
          id="date-select"
          value={selectedDate || ''}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
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
                <td>{user.rank}</td>
                <td>
                  <div className="user-info">
                    {user.image && (
                      <img src={user.image} alt={user.username} className="user-img" />
                    )}
                    <span className="username">{user.username}</span>
                  </div>
                </td>
                <td>{user.strikes}</td>
                <td>{user.correct ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-guesses">No answers have been submitted for this puzzle.</p>
      )}

      {/* Message Board Toggle Button */}
      <div className="message-board-toggle-container">
        <button onClick={handleToggleMessageBoard} className="message-board-toggle-button">
          {showMessageBoard ? 'Hide Message Board' : 'Show Message Board'}
        </button>
      </div>

      {/* Message Board */}
      {showMessageBoard && (
        <div className="message-board-container">
          <h3 className="message-board-title">Message Board</h3>
          {/* Message List */}
          <div className="message-list">
            {messages.length > 0 ? (
              messages.map((message) => (
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
              ))
            ) : (
              <p>No messages yet. Be the first to post!</p>
            )}
          </div>
          {/* Message Input */}
          <div className="message-input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
            ></textarea>
            <button onClick={handlePostMessage} className="message-post-button">
              Post Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyLeaderboard;
