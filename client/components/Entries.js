// components/Entries.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnswers } from '../store/allAnswersStore';

function Entries() {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.allAnswers || []);

  useEffect(() => {
    dispatch(fetchAnswers());
  }, [dispatch]);

  // Extract puzzle numbers
  const puzzleNumbers = answers.map((answer) => answer.number);

  // Determine the highest puzzle number
  const highestPuzzleNumber = puzzleNumbers.length > 0 ? Math.max(...puzzleNumbers) : null;

  // Filter answers for the highest puzzle number
  const entriesForHighestPuzzle = highestPuzzleNumber
    ? answers.filter((answer) => answer.number === highestPuzzleNumber)
    : [];

  // Count the number of entries
  const numberOfEntries = entriesForHighestPuzzle.length;

  return (
    <div className="entries-container">
      {highestPuzzleNumber ? (
        <>
          <h2 className="entries-heading"># of Entries for {highestPuzzleNumber}</h2>
          <div className="entries-count">{numberOfEntries}</div>
        </>
      ) : (
        <h2 className="entries-heading">No entries available.</h2>
      )}
    </div>
  );
}

export default Entries;
