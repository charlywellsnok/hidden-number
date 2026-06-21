import React from 'react'

export default function StreakCounter({ currentStreak, longestStreak }) {
  return (
    <div className="StreakText">
      <p style={{ margin: 0, color: 'white' }}>
        Current Streak: {currentStreak}, Longest Streak: {longestStreak}
      </p>
    </div>
  )
}