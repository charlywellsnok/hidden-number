import React from 'react'

const MasteredList = ({ masteredCards, onUnmaster }) => {
  const validCards = masteredCards.filter(Boolean)
  if (validCards.length === 0) return null

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', color: 'white' }}>
      <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px' }}>
        Mastered Concepts
      </h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {validCards.map((card) => (
          <li 
            key={card.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '10px 15px',
              borderRadius: '6px',
              margin: '8px 0'
            }}
          >
            <span>{card.question}</span>
            <button 
              onClick={() => onUnmaster(card.id)}
              style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Unmaster
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MasteredList