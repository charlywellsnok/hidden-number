import React, { useState, useMemo, useEffect } from 'react'
import './App.css'

import queueImg from './FiFo.jpeg'
import stackImg from './STACK.jpeg'
import BIGO from './BigO.jpeg'
import DP from './DP.jpeg'

const ALL_CARDS = [
  {
    id: 'stack',
    question: 'What is a Stack?',
    image: stackImg,
    answer: 'A LIFO (Last In First Out) data structure.',
    difficulty: 'Easy'
  },
  {
    id: 'queue',
    question: 'What is a Queue?',
    image: queueImg,
    answer: 'A FIFO (First In First Out) data structure.',
    difficulty: 'Easy'
  },
  {
    id: 'bigo',
    question: 'What is Big O Notation?',
    image: BIGO,
    answer: 'A way to describe the efficiency of an algorithm.',
    difficulty: 'Medium'
  },
  {
    id: 'dp',
    question: 'What is Dynamic Programming?',
    image: DP,
    answer: 'A technique that solves complex problems by breaking them into smaller subproblems.',
    difficulty: 'Hard'
  }
]

// Strips punctuation, accents, and converts to lowercase
const normalize = (str) =>
  str
    .toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // removes text accents
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, '')      // strips punctuation
    .replace(/\s+/g, ' ')                             // unifies spacing

// Intelligent fuzzy matching function
const isGuessCorrect = (guess, answer) => {
  const normGuess = normalize(guess)
  const normAnswer = normalize(answer)
  
  if (!normGuess) return false
  
  // Rule 1: Direct Substring or Exact Match (handles short answers cleanly)
  if (normAnswer.includes(normGuess) || normGuess.includes(normAnswer)) {
    return true
  }
  
  // List of common technical filler words to ignore for concept checks
  const fillerWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'it', 'in', 'on', 
    'at', 'by', 'of', 'for', 'with', 'to', 'that', 'this', 'data', 'structure'
  ])
  
  // Rule 2: Tokenized Keyword Check
  // Splits answers into arrays of clean standalone words
  const guessWords = normGuess.split(' ').filter(w => w.length > 1 && !fillerWords.has(w))
  const answerWords = normAnswer.split(' ').filter(w => w.length > 1 && !fillerWords.has(w))
  
  if (guessWords.length === 0) return false

  // Counts how many core concepts/keywords the user guessed correctly
  let matchCount = 0
  guessWords.forEach(gWord => {
    // Matches if the exact word exists or is a close root variant (e.g., "shuffling" vs "shuffle")
    const found = answerWords.some(aWord => aWord.includes(gWord) || gWord.includes(aWord))
    if (found) matchCount++
  })

  // If the user hits at least 50% of the core keywords, mark it correct!
  const matchRatio = matchCount / Math.max(answerWords.length, 1)
  if (matchRatio >= 0.5) return true

  return false
}

const shuffleArray = (arr) => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function App() {
  const [order, setOrder] = useState(ALL_CARDS.map((c) => c.id))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [masteredIds, setMasteredIds] = useState([])

  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null) 
  const [revealed, setRevealed] = useState(false)
  const [manualFlip, setManualFlip] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  const cardsById = useMemo(
    () => Object.fromEntries(ALL_CARDS.map((c) => [c.id, c])),
    []
  )

  const activePool = useMemo(
    () => order.filter((id) => !masteredIds.includes(id)),
    [order, masteredIds]
  )

  const safeIndex = Math.min(currentIndex, Math.max(activePool.length - 1, 0))
  const currentId = activePool[safeIndex]
  const currentCard = currentId ? cardsById[currentId] : null

  // ⚠️ CRITICAL VISUAL NAVIGATION BOUNDARY CHECKS
  const isAtStart = safeIndex === 0
  const isAtEnd = safeIndex === activePool.length - 1

  useEffect(() => {
    setManualFlip(false)
  }, [currentId])

  const resetCardState = () => {
    setGuess('')
    setFeedback(null)
    setRevealed(false)
    setManualFlip(false)
  }

  // Linear progression blocks (No wrap-around actions)
  const handleNextCard = () => {
    if (isAtEnd) return
    setCurrentIndex((i) => Math.min(i + 1, activePool.length - 1))
    resetCardState()
  }

  const handlePreviousCard = () => {
    if (isAtStart) return
    setCurrentIndex((i) => Math.max(i - 1, 0))
    resetCardState()
  }

  const handleShuffle = () => {
    setOrder(shuffleArray(ALL_CARDS.map((c) => c.id)))
    setCurrentIndex(0)
    resetCardState()
  }

  const handleSubmitGuess = () => {
    if (!currentCard || revealed) return
    const correct = isGuessCorrect(guess, currentCard.answer)
    setFeedback(correct ? 'correct' : 'incorrect')
    setRevealed(true)

    if (correct) {
      const nextStreak = currentStreak + 1
      setCurrentStreak(nextStreak)
      if (nextStreak > longestStreak) {
        setLongestStreak(nextStreak)
      }
    } else {
      setCurrentStreak(0)
    }
  }

  const handleResetCounters = () => {
    setCurrentStreak(0)
    setLongestStreak(0)
  }

  const handleMarkMastered = () => {
    if (!currentCard) return
    setMasteredIds((prev) => [...prev, currentCard.id])
    setCurrentIndex((i) => Math.max(0, Math.min(i, activePool.length - 2)))
    resetCardState()
  }

  const handleUnmaster = (id) => {
    setMasteredIds((prev) => prev.filter((m) => m !== id))
  }

  const isCardFlipped = manualFlip || revealed
  const masteredCardsList = masteredIds.map((id) => cardsById[id]).filter(Boolean)

  return (
    <div className="AppContainer">
      <div className="HeaderBlock">
        <h1>Master Your Tech Interviews!</h1>
        <h3>
          How prepared are you for your next software engineering interview?
          Test your knowledge of Data Structures and Algorithms!
        </h3>

        <div className="TopBar">
          <p className="CounterText">
            Cards remaining: {activePool.length} &nbsp;·&nbsp; Mastered: {masteredIds.length}
          </p>
          <p className="StreakText">
            Current Streak: {currentStreak}, Longest Streak: {longestStreak}
          </p>
          <button className="ResetStreaksBtn" onClick={handleResetCounters}>
            Reset Stats ↺
          </button>
        </div>
      </div>

      {currentCard ? (
        <>
          {/* Card Component */}
          <div className="scene" onClick={() => setManualFlip(!isCardFlipped)}>
            <div className={`card-inner ${isCardFlipped ? 'flipped' : ''}`}>
              <div className={`card-face card-front ${currentCard.difficulty}`}>
                <span className="DifficultyTag">{currentCard.difficulty}</span>
                {currentCard.image && (
                  <img src={currentCard.image} alt={currentCard.question} className="CardImage" />
                )}
                <p className="FlashParagraph">{currentCard.question}</p>
              </div>
              <div className="card-face card-back">
                <p className="FlashParagraph">{currentCard.answer}</p>
              </div>
            </div>
          </div>

          {/* User Input Component */}
          <div className="GuessFormRow">
            <label className="GuessLabel">
              Guess the answer here:
              <input
                type="text"
                className="GuessInput"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                disabled={revealed}
                placeholder="Type your guess..."
              />
            </label>
            <button
              className="SubmitGuessButton"
              onClick={handleSubmitGuess}
              disabled={revealed}
            >
              Submit Guess
            </button>
            {feedback === 'correct' && <p className="GuessFeedback Correct">✓ Correct!</p>}
            {feedback === 'incorrect' && <p className="GuessFeedback Incorrect">✗ Not quite — check the back of the card.</p>}
          </div>

          <div className="MasterRow">
            <button className="MasterButton" onClick={handleMarkMastered}>
              ✓ Mark as mastered
            </button>
          </div>

          {/* Updated Nav Action Row */}
          <div className="Buttons">
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
        </>
      ) : (
        <p className="EmptyState">All concepts mastered! Bring them back using the tracker list.</p>
      )}

      {/* Absolute Mastered Tracker Drawer Overlay */}
      <button className="DrawerTrigger" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
        {isDrawerOpen ? '✕ Close List' : `🏆 Mastered List (${masteredCardsList.length})`}
      </button>

      {isDrawerOpen && (
        <div className="MasteredListContainer">
          <h3 className="MasteredHeader">Mastered Concepts</h3>
          <div className="MasteredScrollBox">
            {masteredCardsList.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginTop: '15px' }}>
                No cards mastered yet.
              </p>
            ) : (
              masteredCardsList.map((card) => (
                <div key={card.id} className="MasteredItem">
                  <span>{card.question}</span>
                  <button className="UnmasterBtn" onClick={() => handleUnmaster(card.id)}>Restore</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}