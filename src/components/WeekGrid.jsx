import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import DayCard from './DayCard';
import PageScrollIndicator from './PageScrollIndicator';
import '../styles/week-grid.css';

const WeekGrid = ({ weeksData = [], weekData = [] }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const scrollRef = useRef(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(3); // Start at week 4 (index 3)
  const [currentMonth, setCurrentMonth] = useState('');

  // Use weeksData if provided, otherwise fall back to single week for backward compatibility
  const weeks = useMemo(() => {
    return weeksData.length > 0 ? weeksData : [{ days: weekData, label: 'This Week' }];
  }, [weeksData, weekData]);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    const containerWidth = scrollRef.current.offsetWidth;
    const scrollLeft = scrollRef.current.scrollLeft;
    
    // Calculate which week is currently visible
    const currentIndex = Math.round(scrollLeft / containerWidth);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(currentIndex, weeks.length - 1));
    
    setCurrentWeekIndex(boundedIndex);
    
    // Update current month - prioritize Today card, otherwise use first visible card
    updateCurrentMonth(boundedIndex);
  }, [weeks.length]);

  // Memoized helper function to update month based on visible week
  const updateCurrentMonth = useCallback((weekIndex) => {
    if (!weeks[weekIndex] || !weeks[weekIndex].days || weeks[weekIndex].days.length === 0) return;
    
    const currentWeek = weeks[weekIndex];
    const today = new Date();
    const todayString = today.toDateString();
    
    // First, try to find a "today" card in the current week
    const todayCard = currentWeek.days.find(day => 
      day.status === 'today' && 
      day.fullDate && 
      day.fullDate.toDateString() === todayString
    );
    
    if (todayCard && todayCard.fullDate) {
      // Use the month from the today card
      const monthName = todayCard.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      setCurrentMonth(monthName);
    } else {
      // Fallback to the first day of the visible week
      const firstDay = currentWeek.days[0];
      if (firstDay && firstDay.fullDate) {
        const monthName = firstDay.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        setCurrentMonth(monthName);
      }
    }
  }, [weeks]);

  useEffect(() => {
    if (scrollRef.current && weeks.length > 0) {
      // Throttled scroll handler for better performance
      let scrollTimeout;
      const throttledScrollHandler = () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 16); // ~60fps throttling
      };
      
      const scrollContainer = scrollRef.current;
      scrollContainer.addEventListener('scroll', throttledScrollHandler);
      
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
          
          // Set initial month using the helper function
          updateCurrentMonth(targetWeekIndex);
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(scrollTimeout);
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', throttledScrollHandler);
        }
      };
    }
  }, [weeks, handleScroll, updateCurrentMonth]);

  const completeWorkout = useCallback((weekIndex, dayIndex) => {
    // Trigger streak update event
    document.dispatchEvent(new CustomEvent('workoutCompleted', { 
      detail: { weekIndex, dayIndex } 
    }));
  }, []);

  const makeUpWorkout = useCallback((weekIndex, dayIndex) => {
    // Trigger streak update event
    document.dispatchEvent(new CustomEvent('workoutCompleted', { 
      detail: { weekIndex, dayIndex } 
    }));
  }, []);

  const handleDayClick = useCallback((day, weekIndex, dayIndex) => {
    if (day.status === 'today') {
      completeWorkout(weekIndex, dayIndex);
    } else if (day.status === 'missed') {
      makeUpWorkout(weekIndex, dayIndex);
    }
  }, [completeWorkout, makeUpWorkout]);

  return (
    <div className="weeks-container">
      <div className="month-header">
        <h3 className="month-label">{currentMonth}</h3>
      </div>
      <div className="weeks-scroll" ref={scrollRef}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week-section">
            <div className="days-grid">
              <div className="days-row">
                {week.days.map((day, dayIndex) => {
                  // Calculate day name directly (moved outside of useMemo to fix hook rules)
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
    </div>
  );
};

export default WeekGrid;
