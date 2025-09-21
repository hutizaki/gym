import React, { useEffect, useRef, useMemo } from 'react';
import DayCard from './DayCard';
import '../styles/week-grid.css';

const WeekGrid = ({ weeksData = [], weekData = [] }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const scrollRef = useRef(null);

  // Use weeksData if provided, otherwise fall back to single week for backward compatibility
  const weeks = useMemo(() => {
    return weeksData.length > 0 ? weeksData : [{ days: weekData, label: 'This Week' }];
  }, [weeksData, weekData]);

  useEffect(() => {
    if (scrollRef.current && weeks.length > 0) {
      // Use setTimeout to ensure layout is complete
      const timer = setTimeout(() => {
        if (!scrollRef.current) return;
        
        // Snap to week 4 (index 3) in the array - this is now the current week
        const targetWeekIndex = 3;
        
        if (weeks.length > targetWeekIndex) {
          const containerWidth = scrollRef.current.offsetWidth;
          
          // Calculate scroll position to show week 4
          // Each week takes full container width, so multiply by index
          const scrollPosition = targetWeekIndex * containerWidth;
          
          scrollRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'instant'
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [weeks]);

  const handleDayClick = (day, weekIndex, dayIndex) => {
    if (day.status === 'today') {
      completeWorkout(weekIndex, dayIndex);
    } else if (day.status === 'missed') {
      makeUpWorkout(weekIndex, dayIndex);
    }
  };

  const completeWorkout = (weekIndex, dayIndex) => {
    // Trigger streak update event
    document.dispatchEvent(new CustomEvent('workoutCompleted', { 
      detail: { weekIndex, dayIndex } 
    }));
  };

  const makeUpWorkout = (weekIndex, dayIndex) => {
    // Trigger streak update event
    document.dispatchEvent(new CustomEvent('workoutCompleted', { 
      detail: { weekIndex, dayIndex } 
    }));
  };

  return (
    <div className="weeks-container">
      <div className="weeks-scroll" ref={scrollRef}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week-section">
            <div className="week-header">
              <h3 className="week-label">{week.label}</h3>
            </div>
            <div className="days-grid">
              <div className="days-row">
                {week.days.map((day, dayIndex) => (
                  <DayCard
                    key={`${weekIndex}-${dayIndex}`}
                    day={dayNames[dayIndex]}
                    date={day.date}
                    status={day.status}
                    workout={day.workout}
                    friends={day.friends}
                    onClick={() => handleDayClick(day, weekIndex, dayIndex)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekGrid;
