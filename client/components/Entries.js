// // // components/Entries.js

// // import React, { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchAnswers } from '../store/allAnswersStore';

// // function Entries() {
// //   const dispatch = useDispatch();
// //   const answers = useSelector((state) => state.allAnswers || []);

// //   useEffect(() => {
// //     dispatch(fetchAnswers());
// //   }, [dispatch]);

// //   // Extract puzzle numbers
// //   const puzzleNumbers = answers.map((answer) => answer.number);

// //   // Determine the highest puzzle number
// //   const highestPuzzleNumber = puzzleNumbers.length > 0 ? Math.max(...puzzleNumbers) : null;

// //   // Filter answers for the highest puzzle number
// //   const entriesForHighestPuzzle = highestPuzzleNumber
// //     ? answers.filter((answer) => answer.number === highestPuzzleNumber)
// //     : [];

// //   // Count the number of entries
// //   const numberOfEntries = entriesForHighestPuzzle.length;

// //   return (
// //     <div className="entries-container">
// //       {highestPuzzleNumber ? (
// //         <>
// //           <h2 className="entries-heading"># of Entries for {highestPuzzleNumber}</h2>
// //           <div className="entries-count">{numberOfEntries}</div>
// //         </>
// //       ) : (
// //         <h2 className="entries-heading">No entries available.</h2>
// //       )}
// //     </div>
// //   );
// // }

// // export default Entries;

// // components/Entries.js

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAnswers } from '../store/allAnswersStore';

// function Entries() {
//   const dispatch = useDispatch();
//   const answers = useSelector((state) => state.allAnswers || []);

//   useEffect(() => {
//     dispatch(fetchAnswers());
//   }, [dispatch]);

//   // Extract puzzle numbers
//   const puzzleNumbers = answers.map((answer) => answer.number);

//   // Determine the highest puzzle number
//   const highestPuzzleNumber =
//     puzzleNumbers.length > 0 ? Math.max(...puzzleNumbers) : null;

//     console.log("highest", highestPuzzleNumber)

//   // Filter answers for the highest puzzle number
//   const entriesForHighestPuzzle = highestPuzzleNumber
//     ? answers.filter((answer) => answer.number === highestPuzzleNumber)
//     : [];

//   // Count the number of entries
//   const numberOfEntries = entriesForHighestPuzzle.length;

//   // Base puzzle number and date
//   const basePuzzleNumber = 521;
//   const baseDate = new Date('2024-11-13');

//   // Calculate the date for the highest puzzle number
//   let dateForHighestPuzzle = null;
//   if (highestPuzzleNumber !== null) {
//     const daysDifference = highestPuzzleNumber - basePuzzleNumber;
//     dateForHighestPuzzle = new Date(
//       baseDate.getTime() + daysDifference * 24 * 60 * 60 * 1000
//     );
//   }

//   // Format the date
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   const formattedDate = dateForHighestPuzzle
//     ? dateForHighestPuzzle.toLocaleDateString(undefined, options)
//     : null;

//   return (
//     <div className="entries-container">
//       {highestPuzzleNumber ? (
//         <>
//           <h2 className="entries-heading">
//             # of Entries for {formattedDate}
//           </h2>
//           <div className="entries-count">{numberOfEntries}</div>
//         </>
//       ) : (
//         <h2 className="entries-heading">No entries available.</h2>
//       )}
//     </div>
//   );
// }

// export default Entries;

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
