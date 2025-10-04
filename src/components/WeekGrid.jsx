import React, { useEffect, useRef, useMemo, useState } from 'react';
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

  // Track scroll position to determine current week and month
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
    
    // When user scrolls, always show month of first card in visible week
    updateCurrentMonthFromScroll(boundedIndex);
  };

  // Helper function to update month based on visible week (for initial load - prioritizes Today card)
  const updateCurrentMonth = (weekIndex) => {
    if (!weeks[weekIndex] || !weeks[weekIndex].days || weeks[weekIndex].days.length === 0) return;
    
    const currentWeek = weeks[weekIndex];
    const today = new Date();
    
    // First, try to find a "today" card in the current week
    const todayCard = currentWeek.days.find(day => 
      day.status === 'today' && 
      day.fullDate && 
      day.fullDate.toDateString() === today.toDateString()
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
  };

  // Helper function to update month when user scrolls (always uses first card)
  const updateCurrentMonthFromScroll = (weekIndex) => {
    if (!weeks[weekIndex] || !weeks[weekIndex].days || weeks[weekIndex].days.length === 0) return;
    
    const currentWeek = weeks[weekIndex];
    const firstDay = currentWeek.days[0];
    
    if (firstDay && firstDay.fullDate) {
      const monthName = firstDay.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      setCurrentMonth(monthName);
    }
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
          
          // Set initial month using the helper function
          updateCurrentMonth(targetWeekIndex);
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

  // Update month when weeks data changes
  useEffect(() => {
    if (weeks.length > 0) {
      const targetWeekIndex = 3; // Start at week 4 (index 3)
      if (weeks[targetWeekIndex]) {
        updateCurrentMonth(targetWeekIndex);
      }
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
      <div className="month-header">
        <h3 className="month-label">{currentMonth}</h3>
      </div>
      <div className="weeks-scroll" ref={scrollRef}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week-section">
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
    </div>
  );
};

export default WeekGrid;
