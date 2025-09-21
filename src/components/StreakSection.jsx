import React, { useState, useEffect } from 'react';
import '../styles/streak-section.css';

const StreakSection = ({ count = 4, label = 'Day Streak' }) => {
  const [streakCount, setStreakCount] = useState(count);

  useEffect(() => {
    // Listen for workout completed events
    const handleWorkoutCompleted = () => {
      setStreakCount(prev => prev + 1);
      animateStreakUpdate();
    };

    document.addEventListener('workoutCompleted', handleWorkoutCompleted);
    
    return () => {
      document.removeEventListener('workoutCompleted', handleWorkoutCompleted);
    };
  }, []);

  const animateStreakUpdate = () => {
    const streakNumber = document.querySelector('.streak-number');
    if (streakNumber) {
      streakNumber.style.transform = 'scale(1.2)';
      streakNumber.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        streakNumber.style.transform = 'scale(1)';
      }, 300);
    }
  };

  return (
    <div className="streak-section">
      <div className="streak-content">
        <div className="streak-number">🔥 {streakCount}</div>
        <div className="streak-label">{label}</div>
      </div>
    </div>
  );
};

export default StreakSection;
