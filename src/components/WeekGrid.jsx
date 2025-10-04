import React, { useEffect, useRef, useMemo, useState } from 'react';
import DayCard from './DayCard';
import PageScrollIndicator from './PageScrollIndicator';
import '../styles/week-grid.css';

const WeekGrid = ({ weeksData = [], weekData = [] }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const scrollRef = useRef(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(3); // Start at week 4 (index 3)

  // Use weeksData if provided, otherwise fall back to single week for backward compatibility
  const weeks = useMemo(() => {
    return weeksData.length > 0 ? weeksData : [{ days: weekData, label: 'This Week' }];
  }, [weeksData, weekData]);

  // Track scroll position to determine current week
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const containerWidth = scrollRef.current.offsetWidth;
    const scrollLeft = scrollRef.current.scrollLeft;
    
    // Calculate which week is currently visible
    // Add half container width to snap to the center of each week
    const currentIndex = Math.round(scrollLeft / containerWidth);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(currentIndex, weeks.length - 1));
    
    setCurrentWeekIndex(boundedIndex);
  };

  useEffect(() => {
    if (scrollRef.current && weeks.length > 0) {
      // Add scroll event listener
      const scrollContainer = scrollRef.current;
      scrollContainer.addEventListener('scroll', handleScroll);
      
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
          
          // Update current week index after initial scroll
          setCurrentWeekIndex(targetWeekIndex);
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
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
                {week.days.map((day, dayIndex) => {
                  // Get actual day name from the date
                  const actualDayName = day.fullDate ? day.fullDate.toLocaleDateString('en-US', { weekday: 'short' }) : dayNames[dayIndex];
                  
                  return (
                    <DayCard
                      key={`${weekIndex}-${dayIndex}`}
                      day={actualDayName}
                      date={day.date}
                      status={day.status}
                      workout={day.workout}
                      friends={day.friends}
                      onClick={() => handleDayClick(day, weekIndex, dayIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mb-2">
        <PageScrollIndicator numberOfPages={weeks.length} 
                            currentPage={currentWeekIndex}
        />
      </div>
    </div>
  );
};

export default WeekGrid;
