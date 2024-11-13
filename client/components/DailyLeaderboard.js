import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnswers } from '../store/allAnswersStore';
import { fetchUsers } from '../store/allUsersStore';

function DailyLeaderboard() {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.allAnswers || []);
  const users = useSelector((state) => state.allUsers || []);

  // State for selected puzzle number
  const [selectedDate, setSelectedDate] = useState(null);

  console.log("select", selectedDate)


  useEffect(() => {
    dispatch(fetchAnswers());
    dispatch(fetchUsers());
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
    </div>
  );
}

export default DailyLeaderboard;
