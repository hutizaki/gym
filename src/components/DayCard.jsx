import React from 'react';
import '../styles/day-card.css';
import dumbbellIcon from '../assets/Dumbbell_Weights.png';

const DayCard = ({ day, date, status, workout, friends, onClick }) => {
  return (
    <div className="day-card-container">
      <div className="day-of-week">
        <span>{day}</span>
      </div>
        <div className={`day-card ${status || ''}`} onClick={onClick}>
          {date && <div className="day-date">{date}</div>}
          {status === 'completed' && <div className="workout-icon">
            {workout ? workout : <img src={dumbbellIcon} alt="dumbbell"/>}
          </div>}
        {friends && friends.length > 0 && (
          <div className={`day-friends ${friends.length > 2 ? 'overlapping' : ''}`}>
            {friends.slice(0, 3).map((friend, i) => (
              <div
                key={i}
                className={`friend-avatar avatar-${(i % 4) + 1}`}
              >
                {friend}
              </div>
            ))}
            {friends.length > 3 && (
              <span className="ellipsis">...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCard;
