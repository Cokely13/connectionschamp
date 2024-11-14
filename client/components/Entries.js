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
  const highestPuzzleNumber =
    puzzleNumbers.length > 0 ? Math.max(...puzzleNumbers) : null;

  // Filter answers for the highest puzzle number
  const entriesForHighestPuzzle = highestPuzzleNumber
    ? answers.filter((answer) => answer.number === highestPuzzleNumber)
    : [];

  // Count the number of entries
  const numberOfEntries = entriesForHighestPuzzle.length;

  // Get the date from the answer(s) associated with the highest puzzle number
  let dateForHighestPuzzle = null;
  if (entriesForHighestPuzzle.length > 0) {
    // Assuming all answers for the same puzzle number have the same date
    dateForHighestPuzzle = entriesForHighestPuzzle[0].date;
  }

  // Format the date
  let formattedDate = null;
  if (dateForHighestPuzzle) {
    const dateObj = new Date(dateForHighestPuzzle);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    formattedDate = dateObj.toLocaleDateString(undefined, options);
  }

  console.log("entries", entriesForHighestPuzzle)

  return (
    <div className="entries-container">
      {highestPuzzleNumber ? (
        <>
          <h2 className="entries-heading">
            # of Entries for {entriesForHighestPuzzle[0].date}
          </h2>
          <div className="entries-count">{numberOfEntries}</div>
        </>
      ) : (
        <h2 className="entries-heading">No entries available.</h2>
      )}
    </div>
  );
}

export default Entries;
