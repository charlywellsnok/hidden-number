import React from 'react'

const Navigation = ({
  handlePreviousCard,
  handleNextCard,
  handleShuffle,
  isAtStart,
  isAtEnd
}) => {
  return (
    <div className="Buttons">
      {/* disabled attributes prevent wrap-around navigation when boundary limits are hit */}
      <button onClick={handlePreviousCard} disabled={isAtStart}>
        ← Back
      </button>

      <button onClick={handleShuffle} className="ShuffleButton">
        Shuffle Cards
      </button>

      <button onClick={handleNextCard} disabled={isAtEnd}>
        Next →
      </button>
    </div>
  )
}

export default Navigation