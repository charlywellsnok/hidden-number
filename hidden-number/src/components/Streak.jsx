// Displays the user's current correct-answer streak and their best-ever streak.
const Streak = ({ current, longest }) => {
  return (
    <div className="StreakBox">
      <span className="StreakItem">🔥 Streak: {current}</span>
      <span className="StreakItem">🏆 Best: {longest}</span>
    </div>
  )
}
 
export default Streak