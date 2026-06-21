import React from 'react'

const GuessForm = ({ guess, onGuessChange, onSubmit, feedback, disabled }) => {
  return (
    <div className="GuessFormRow">
      <label className="GuessLabel">
        Guess the answer here:
        <input
          type="text"
          className="GuessInput"
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          disabled={disabled}
          placeholder="Type your guess..."
        />
      </label>
      <button
        className="SubmitGuessButton"
        onClick={onSubmit}
        disabled={disabled}
      >
        Submit Guess
      </button>

      {/* Evaluates state to apply visual correct/incorrect feedback styles dynamically */}
      {feedback === 'correct' && (
        <p className="GuessFeedback Correct">✓ Correct!</p>
      )}
      {feedback === 'incorrect' && (
        <p className="GuessFeedback Incorrect">✗ Not quite — check the back of the card.</p>
      )}
    </div>
  )
}

export default GuessForm