// components/CareerLeaderboard.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnswers } from '../store/allAnswersStore';
import { fetchUsers } from '../store/allUsersStore';

function CareerLeaderboard() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers || []);
  const answers = useSelector((state) => state.allAnswers || []);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAnswers());
  }, [dispatch]);

  // Build userStats: { [userId]: { wins, totalStrikes } }
  const userStats = {};

  answers.forEach((answer) => {
    const { userId, correct, strikes } = answer;
    if (!userStats[userId]) {
      userStats[userId] = { wins: 0, totalStrikes: 0, losses: 0 };
    }
    if (correct) {
      userStats[userId].wins += 1;
    }
    if (!correct) {
      userStats[userId].losses += 1;
    }
    userStats[userId].totalStrikes += strikes;
  });

  // Build usersWithStats array
  const usersWithStats = users.map((user) => {
    const stats = userStats[user.id] || { wins: 0, totalStrikes: 0, losses: 0 };
    return {
      ...user,
      wins: stats.wins,
      losses: stats.losses,
      totalStrikes: stats.totalStrikes,
    };
  });

  // Sort users by number of wins (descending), then by totalStrikes (ascending)
  const sortedUsers = usersWithStats.sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins; // More wins first
    } else {
      return a.totalStrikes - b.totalStrikes; // Fewer strikes first
    }
  });

  // Assign ranks
  let rank = 1;
  let prevWins = null;
  let prevStrikes = null;

  sortedUsers.forEach((user, index) => {
    if (user.wins !== prevWins || user.totalStrikes !== prevStrikes) {
      rank = index + 1;
    }
    user.rank = rank; // Store rank in user object
    prevWins = user.wins;
    prevStrikes = user.totalStrikes;
  });

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">Career Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Total Strikes</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td style={{ textAlign: 'center' }}>
                {user.rank === 1 && <span className="medal gold">🥇</span>}
                {user.rank === 2 && <span className="medal silver">🥈</span>}
                {user.rank === 3 && <span className="medal bronze">🥉</span>}
                {user.rank}
              </td>
              <td>
                <div className="user-info">
                  {user.image && (
                    <img src={user.image} alt={user.username} className="user-img" />
                  )}
                  <span className="username">{user.username}</span>
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>{user.wins}</td>
              <td style={{ textAlign: 'center' }}>{user.losses}</td>
              <td style={{ textAlign: 'center' }}>{user.totalStrikes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CareerLeaderboard;
