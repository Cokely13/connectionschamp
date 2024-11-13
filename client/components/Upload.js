// // components/Upload.js

// import React, { useState } from 'react';

// const Upload = () => {
//   const [sharedText, setSharedText] = useState('');
//   const [parsedData, setParsedData] = useState(null);

//   const parseSharedResults = (text) => {
//     const lines = text.trim().split('\n');
//     let puzzleNumber = null;
//     let guesses = [];
//     let correct = false;
//     let strikes = 0;

//     // Extract Puzzle Number
//     for (const line of lines) {
//       const match = line.match(/Puzzle\s*#(\d+)/i);
//       if (match) {
//         puzzleNumber = parseInt(match[1], 10);
//         break;
//       }
//     }

//     // Identify Guess Lines
//     const emojiLineRegex = /^[\u{1F7E5}-\u{1F7EB}\u{1F7E0}-\u{1F7E2}\u{2B1B}\u{2B1C}\u{1F7E8}\u{1F7E9}\u{1F7E6}]+$/u;
//     for (const line of lines) {
//       if (emojiLineRegex.test(line)) {
//         guesses.push(line);
//       }
//     }

//     // Determine strikes and correctness
//     for (let i = 0; i < guesses.length; i++) {
//       const guessLine = guesses[i];
//       const emojis = [...guessLine];
//       const firstEmoji = emojis[0];
//       const isCorrectGuess = emojis.every((emoji) => emoji === firstEmoji);

//       if (isCorrectGuess) {
//         // Correct guess
//         if (i === guesses.length - 1) {
//           // Last guess is correct
//           correct = true;
//         }
//         // No strike added for correct guess
//       } else {
//         // Incorrect guess, increment strikes
//         strikes += 1;
//       }
//     }

//     if (puzzleNumber !== null) {
//       return { number: puzzleNumber, correct, strikes };
//     } else {
//       return null; // Parsing failed
//     }
//   };

//   const handleSubmit = () => {
//     const parsedData = parseSharedResults(sharedText);
//     if (parsedData) {
//       setParsedData(parsedData);
//     } else {
//       alert('Failed to parse the shared results. Please check the format and try again.');
//     }
//   };

//   return (
//     <div>
//       <h2>Submit Your Connections Results</h2>
//       <textarea
//         value={sharedText}
//         onChange={(e) => setSharedText(e.target.value)}
//         placeholder="Paste your results here..."
//         rows="6"
//         cols="50"
//       ></textarea>
//       <br />
//       <button onClick={handleSubmit}>Submit</button>

//       {/* Display the parsed results */}
//       {parsedData && (
//         <div>
//           <h3>Parsed Results:</h3>
//           <p>
//             <strong>Puzzle Number:</strong> {parsedData.number}
//           </p>
//           <p>
//             <strong>Strikes:</strong> {parsedData.strikes}
//           </p>
//           <p>
//             <strong>Correct:</strong> {parsedData.correct ? 'Yes' : 'No'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Upload;

// components/Upload.js

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAnswer } from '../store/allAnswersStore'; // Adjust the path as necessary

const Upload = () => {
  const [sharedText, setSharedText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const dispatch = useDispatch();

  const parseSharedResults = (text) => {
    const lines = text.trim().split('\n');
    let puzzleNumber = null;
    let guesses = [];
    let correct = false;
    let strikes = 0;

    // Extract Puzzle Number
    for (const line of lines) {
      const match = line.match(/Puzzle\s*#(\d+)/i);
      if (match) {
        puzzleNumber = parseInt(match[1], 10);
        break;
      }
    }

    // Identify Guess Lines
    const emojiLineRegex = /^[\u{1F7E5}-\u{1F7EB}\u{1F7E0}-\u{1F7E2}\u{2B1B}\u{2B1C}\u{1F7E8}\u{1F7E9}\u{1F7E6}]+$/u;
    for (const line of lines) {
      if (emojiLineRegex.test(line)) {
        guesses.push(line);
      }
    }

    // Determine strikes and correctness
    for (let i = 0; i < guesses.length; i++) {
      const guessLine = guesses[i];
      const emojis = [...guessLine];
      const firstEmoji = emojis[0];
      const isCorrectGuess = emojis.every((emoji) => emoji === firstEmoji);

      if (isCorrectGuess) {
        // Correct guess
        if (i === guesses.length - 1) {
          // Last guess is correct
          correct = true;
        }
        // No strike added for correct guess
      } else {
        // Incorrect guess, increment strikes
        strikes += 1;
      }
    }

    if (puzzleNumber !== null) {
      return { number: puzzleNumber, correct, strikes };
    } else {
      return null; // Parsing failed
    }
  };

  const handleSubmit = () => {
    const parsedResult = parseSharedResults(sharedText);
    if (parsedResult) {
      setParsedData(parsedResult);
    } else {
      alert('Failed to parse the shared results. Please check the format and try again.');
    }
  };

  // Use useEffect to dispatch the action when parsedData changes
  useEffect(() => {
    if (parsedData) {
      dispatch(createAnswer(parsedData));
    }
  }, [parsedData, dispatch]);

  return (
    <div>
      <h2>Submit Your Connections Results</h2>
      <textarea
        value={sharedText}
        onChange={(e) => setSharedText(e.target.value)}
        placeholder="Paste your results here..."
        rows="6"
        cols="50"
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>

      {/* Display the parsed results */}
      {parsedData && (
        <div>
          <h3>Parsed Results:</h3>
          <p>
            <strong>Puzzle Number:</strong> {parsedData.number}
          </p>
          <p>
            <strong>Strikes:</strong> {parsedData.strikes}
          </p>
          <p>
            <strong>Correct:</strong> {parsedData.correct ? 'Yes' : 'No'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Upload;
