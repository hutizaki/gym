import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import DayCard from './DayCard';
import '../styles/horizontal-day-scroll.css';

const HorizontalDayScroll = ({ weeksData = [], weekData = [] }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [currentMonth, setCurrentMonth] = useState('');
  const scrollContainerRef = useRef(null);

  // Use weeksData if provided, otherwise fall back to single week for backward compatibility
  const weeks = useMemo(() => {
    return weeksData.length > 0 ? weeksData : [{ days: weekData, label: 'This Week' }];
  }, [weeksData, weekData]);

  // Flatten all days from all weeks into a single array for horizontal scrolling
  const allDays = useMemo(() => {
    const days = [];
    weeks.forEach((week, weekIndex) => {
      week.days.forEach((day, dayIndex) => {
        days.push({
          ...day,
          weekIndex,
          dayIndex,
          actualDayName: day.fullDate 
            ? day.fullDate.toLocaleDateString('en-US', { weekday: 'short' })
            : dayNames[dayIndex]
        });
      });
    });
    return days;
  }, [weeks, dayNames]);

  // Memoized helper function to update month based on visible day
  const updateCurrentMonth = useCallback(() => {
    if (allDays.length === 0) return;
    
    const today = new Date();
    const todayString = today.toDateString();
    
    // First, try to find a "today" card
    const todayCard = allDays.find(day => 
      day.status === 'today' && 
      day.fullDate && 
      day.fullDate.toDateString() === todayString
    );
    
    if (todayCard && todayCard.fullDate) {
      // Use the month from the today card
      const monthName = todayCard.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      setCurrentMonth(monthName);
    } else {
      // Fallback to the first day
      const firstDay = allDays[0];
      if (firstDay && firstDay.fullDate) {
        const monthName = firstDay.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        setCurrentMonth(monthName);
      }
    }
  }, [allDays]);

  // Handle scroll events to update current month
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const containerWidth = scrollContainerRef.current.offsetWidth;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    
    // Calculate which day is currently visible (assuming each day takes ~80px width)
    const dayWidth = 80; // Approximate width of each day card
    const currentDayIndex = Math.round(scrollLeft / dayWidth);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(currentDayIndex, allDays.length - 1));
    
    // Update month based on the visible day
    if (allDays[boundedIndex] && allDays[boundedIndex].fullDate) {
      const monthName = allDays[boundedIndex].fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      setCurrentMonth(monthName);
    }
  }, [allDays]);

  // Initialize scroll position and set up event listeners
  useEffect(() => {
    if (scrollContainerRef.current && allDays.length > 0) {
      // Throttled scroll handler for better performance
      let scrollTimeout;
      const throttledScrollHandler = () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 16); // ~60fps throttling
      };
      
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.addEventListener('scroll', throttledScrollHandler);
      
      // Set initial month
      updateCurrentMonth();
      
      return () => {
        clearTimeout(scrollTimeout);
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', throttledScrollHandler);
        }
      };
    }
  }, [allDays, handleScroll, updateCurrentMonth]);

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

  const handleDayClick = useCallback((day) => {
    if (day.status === 'today') {
      completeWorkout(day.weekIndex, day.dayIndex);
    } else if (day.status === 'missed') {
      makeUpWorkout(day.weekIndex, day.dayIndex);
    }
  }, [completeWorkout, makeUpWorkout]);

  return (
    <div className="horizontal-day-scroll-container">
      <div className="month-header">
        <h3 className="month-label">{currentMonth}</h3>
      </div>
      
      <div className="horizontal-scroll-wrapper" ref={scrollContainerRef}>
        <div className="horizontal-days-container">
          {allDays.map((day, index) => (
            <DayCard
              key={`${day.weekIndex}-${day.dayIndex}`}
              day={day.actualDayName}
              date={day.date}
              status={day.status}
              workout={day.workout}
              friends={day.friends}
              onClick={() => handleDayClick(day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalDayScroll;
