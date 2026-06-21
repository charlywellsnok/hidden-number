import React from 'react'

const CardCounter = ({ totalCards, masteredCount }) => {
  return (
    <div>
      <p className="CounterText">
        Cards remaining: {totalCards} &nbsp;·&nbsp; Mastered: {masteredCount}
      </p>
    </div>
  )
}

export default CardCounter