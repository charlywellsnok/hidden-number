import React, { useState, useEffect } from 'react'

const FlashCards = ({ card, isFlipped: forcedFlip = false }) => {
  const [manualFlip, setManualFlip] = useState(false)

  // Combines manual click and automated submit state triggers
  const isFlipped = manualFlip || forcedFlip

  const handleFlip = () => {
    setManualFlip(!isFlipped)
  }

  // Resets card back to front side whenever a new card concept loads
  useEffect(() => {
    setManualFlip(false)
  }, [card])

  return (
    <div className="scene" onClick={handleFlip}>
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT — Explicitly has card-face and card-front styles */}
        <div className={`card-face card-front ${card.difficulty}`}>
          <span className="DifficultyTag">{card.difficulty}</span>
          {card.image && (
            <img src={card.image} alt={card.question} className="CardImage" />
          )}
          <p className="FlashParagraph">{card.question}</p>
        </div>

        {/* BACK — Explicitly has card-face and card-back styles */}
        <div className="card-face card-back">
          <p className="FlashParagraph">{card.answer}</p>
        </div>

      </div>
    </div>
  )
}

export default FlashCards