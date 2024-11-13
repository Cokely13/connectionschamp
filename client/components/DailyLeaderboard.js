// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAnswers } from '../store/allAnswersStore';
// import { fetchUsers } from '../store/allUsersStore';

// function DailyLeaderboard() {
//   const dispatch = useDispatch();
//   const answers = useSelector((state) => state.allAnswers || []);
//   const users = useSelector((state) => state.allUsers || []);

//   // State for selected date
//   const todayDate = new Date().toISOString().split('T')[0];
//   const [selectedDate, setSelectedDate] = useState(todayDate);

//   useEffect(() => {
//     dispatch(fetchAnswers());
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Create a map of userId to username and image for quick lookup
//   const usersMap = {};
//   users.forEach((user) => {
//     usersMap[user.id] = { username: user.username, image: user.image };
//   });



//   // Render the leaderboard
//   return (
//     <div className="leaderboard-container">
//       <h2 className="leaderboard-heading">
//         Leaderboard for {selectedAnswer.number}
//       </h2>

//       {/* Date Selection Dropdown */}
//       <div className="date-selection">
//         <label htmlFor="date-select">Select Date: </label>
//         <select
//           id="date-select"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//         >
//           {uniqueDateOptions.map((option) => (
//             <option key={option.dateAsked} value={option.dateAsked}>
//               {option.formattedDate}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display Answer Text */}
//       {selectedAnswer ? (
//         <div className="question-text">
//           <p>{selectedAnswer.text}</p>
//         </div>
//       ) : (
//         <div className="no-question">
//           <p>No Answer</p>
//         </div>
//       )}

//       {leaderboard.length > 0 ? (
//         <table className="leaderboard-table">
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Rank</th>
//               <th>Points</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaderboard.map((user) => (
//               <tr key={user.userId}>
//                 <td>
//   <div className="user-info">
//     <img src={user.image} alt={user.username} className="user-img" />
//     <span className="username">{user.username}</span>
//   </div>
// </td>
//                 <td style={{ textAlign: 'center' }}>{user.rank}</td>
//                 <td style={{ textAlign: 'center' }}>{user.points}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="no-guesses">No guesses have been made for this date.</p>
//       )}
//     </div>
//   );
// }

// export default DailyLeaderboard;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnswers } from '../store/allAnswersStore';
import { fetchUsers } from '../store/allUsersStore';

function DailyLeaderboard() {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.allAnswers || []);
  const users = useSelector((state) => state.allUsers || []);

  // State for selected puzzle number
  const [selectedNumber, setSelectedNumber] = useState(null);

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
  const uniqueNumbers = [...new Set(answers.map((answer) => answer.number))].sort((a, b) => a - b);

  // Set default selectedNumber to the latest puzzle number if not set
  useEffect(() => {
    if (uniqueNumbers.length > 0 && selectedNumber === null) {
      setSelectedNumber(uniqueNumbers[uniqueNumbers.length - 1]); // Select the latest puzzle by default
    }
  }, [uniqueNumbers, selectedNumber]);

  // Filter answers for the selected puzzle number
  const filteredAnswers = answers.filter((answer) => answer.number === selectedNumber);

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
      <h2 className="leaderboard-heading">Leaderboard for Puzzle #{selectedNumber}</h2>

      {/* Puzzle Number Selection Dropdown */}
      <div className="number-selection">
        <label htmlFor="number-select">Select Puzzle Number: </label>
        <select
          id="number-select"
          value={selectedNumber || ''}
          onChange={(e) => setSelectedNumber(parseInt(e.target.value, 10))}
        >
          {uniqueNumbers.map((number) => (
            <option key={number} value={number}>
              Puzzle #{number}
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
