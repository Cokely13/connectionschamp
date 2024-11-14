import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { createAnswer, fetchAnswers } from '../store/allAnswersStore';
import { fetchSingleUser } from '../store/singleUserStore';

const Upload = () => {
  const [sharedText, setSharedText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.singleUser);
  const answers = useSelector((state) => state.allAnswers || []);

  useEffect(() => {
    dispatch(fetchSingleUser(id));
    dispatch(fetchAnswers());
  }, [dispatch, id]);

  const parseSharedResults = (text) => {
    const lines = text.trim().split('\n');
    let puzzleNumber = null;
    let guesses = [];
    let correct = false;
    let strikes = 0;
    let userId = id;

    // Extract Puzzle Number
    for (const line of lines) {
      const match = line.match(/Puzzle\s*#(\d+)/i);
      if (match) {
        puzzleNumber = parseInt(match[1], 10);
        break;
      }
    }

    // Identify Guess Lines
    const emojiLineRegex =
      /^[\u{1F7E5}-\u{1F7EB}\u{1F7E0}-\u{1F7E2}\u{2B1B}\u{2B1C}\u{1F7E8}\u{1F7E9}\u{1F7E6}]+$/u;
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
      // Calculate the date based on the puzzle number
      const basePuzzleNumber = 521;
      const baseDate = new Date('2024-11-13');

      const daysDifference = puzzleNumber - basePuzzleNumber;
      console.log("days", daysDifference)
      const date = new Date(
        baseDate.getTime() + daysDifference * 24 * 60 * 60 * 1000
      );
      console.log("date", date)
      // Format the date as YYYY-MM-DD for Sequelize.DATEONLY
      const formattedDate = date.toISOString().split('T')[0];

      return { number: puzzleNumber, correct, strikes, userId, date: formattedDate };
    } else {
      return null; // Parsing failed
    }
  };

  const handleSubmit = () => {
    const parsedResult = parseSharedResults(sharedText);
    if (parsedResult) {
      const existingAnswer = answers.find(
        (answer) => answer.userId === id && answer.number === parsedResult.number
      );

      if (existingAnswer) {
        alert('You have already submitted an answer for this puzzle.');
        return;
      }
      // Check if the user got it correct or has exactly 4 strikes
      if (parsedResult.correct || parsedResult.strikes === 4) {
        setParsedData(parsedResult);
        dispatch(createAnswer(parsedResult));
        setSharedText(''); // Clear the input field
      } else {
        alert('Invalid results. An answer must have 4 strikes or be correct.');
      }
    } else {
      alert(
        'Failed to parse the shared results. Please check the format and try again.'
      );
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-heading">Submit Your Connections Results</h2>
      <textarea
        className="upload-textarea"
        value={sharedText}
        onChange={(e) => setSharedText(e.target.value)}
        placeholder="Paste your results here..."
        rows="10"
      ></textarea>
      <button className="upload-button" onClick={handleSubmit}>
        Submit
      </button>

      {/* Display the parsed results */}
      {parsedData && (
        <div className="parsed-results">
          <h3>Submitted Results:</h3>
          <p>
            <strong>Puzzle Number:</strong> {parsedData.number}
          </p>
          <p>
            <strong>Date:</strong> {parsedData.date}
          </p>
          <p>
            <strong>Strikes:</strong> {parsedData.strikes}
          </p>
          <p>
            <strong>Correct:</strong> {parsedData.correct ? 'Yes' : 'No'}
          </p>
          <p>
          <Link to={`/leaderboard`}>Go To Leaderboard</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Upload;
