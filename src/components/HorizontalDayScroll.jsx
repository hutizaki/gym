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

  // Create a month tracking system
  const monthData = useMemo(() => {
    if (allDays.length === 0) return { months: [], monthRanges: {} };
    
    const months = [];
    const monthRanges = {};
    let currentMonth = null;
    let monthStartIndex = 0;
    
    allDays.forEach((day, index) => {
      if (day.fullDate) {
        const dayMonth = day.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        if (currentMonth !== dayMonth) {
          // New month detected
          if (currentMonth !== null) {
            // Save the previous month's range
            monthRanges[currentMonth] = {
              start: monthStartIndex,
              end: index - 1,
              count: index - monthStartIndex
            };
          }
          
          // Start tracking new month
          currentMonth = dayMonth;
          monthStartIndex = index;
          months.push(dayMonth);
        }
      }
    });
    
    // Handle the last month
    if (currentMonth !== null) {
      monthRanges[currentMonth] = {
        start: monthStartIndex,
        end: allDays.length - 1,
        count: allDays.length - monthStartIndex
      };
    }
    
    return { months, monthRanges };
  }, [allDays]);

  // Memoized helper function to update month based on visible day
  const updateCurrentMonth = useCallback(() => {
    if (allDays.length === 0 || !scrollContainerRef.current) return;
    
    const containerWidth = scrollContainerRef.current.offsetWidth;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    
    // Calculate which day is currently visible (assuming each day takes ~80px width)
    const dayWidth = 80; // Approximate width of each day card
    const currentDayIndex = Math.round(scrollLeft / dayWidth);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(currentDayIndex, allDays.length - 1));
    
    // Find which month this day belongs to
    const visibleDay = allDays[boundedIndex];
    if (visibleDay && visibleDay.fullDate) {
      const monthName = visibleDay.fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      setCurrentMonth(monthName);
    }
  }, [allDays]);

  // Handle scroll events to update current month
  const handleScroll = useCallback(() => {
    updateCurrentMonth();
  }, [updateCurrentMonth]);

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

  // Function to scroll to a specific month
  const scrollToMonth = useCallback((monthName) => {
    if (!scrollContainerRef.current || !monthData.monthRanges[monthName]) return;
    
    const monthRange = monthData.monthRanges[monthName];
    const dayWidth = 80; // Approximate width of each day card
    const scrollPosition = monthRange.start * dayWidth;
    
    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, [monthData.monthRanges]);

  return (
    <div className="horizontal-day-scroll-container">
      <div className="month-header">
        <h3 className="month-label">{currentMonth}</h3>
        {monthData.months.length > 1 && (
          <div className="month-navigation">
            {monthData.months.map((month) => (
              <button
                key={month}
                className={`month-nav-btn ${month === currentMonth ? 'active' : ''}`}
                onClick={() => scrollToMonth(month)}
                title={`Go to ${month}`}
              >
                {month.split(' ')[0]} {/* Show only month name, not year */}
              </button>
            ))}
          </div>
        )}
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
