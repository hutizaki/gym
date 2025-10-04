import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Element, scroller } from 'react-scroll';
import DayCard from './DayCard';
import '../styles/horizontal-day-scroll.css';

const HorizontalDayScroll = ({ weeksData = [], weekData = [] }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentWeekIndex, setCurrentWeekIndex] = useState(3); // Start at week 4 (index 3)
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

  // Handle scroll events to update current week and month
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const containerWidth = scrollContainerRef.current.offsetWidth;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    
    // Calculate which week is currently visible
    const currentIndex = Math.round(scrollLeft / containerWidth);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(currentIndex, weeks.length - 1));
    
    setCurrentWeekIndex(boundedIndex);
    updateCurrentMonth(boundedIndex);
  }, [weeks.length, updateCurrentMonth]);

  // Initialize scroll position and set up event listeners
  useEffect(() => {
    if (scrollContainerRef.current && weeks.length > 0) {
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
      
      // Use setTimeout to ensure layout is complete
      const timer = setTimeout(() => {
        if (!scrollContainerRef.current) return;
        
        // Snap to week 4 (index 3) in the array - this is now the current week
        const targetWeekIndex = 3;
        
        if (weeks.length > targetWeekIndex) {
          const containerWidth = scrollContainerRef.current.offsetWidth;
          
          // Calculate scroll position to show week 4
          // Each week takes full container width, so multiply by index
          const scrollPosition = targetWeekIndex * containerWidth;
          
          scrollContainerRef.current.scrollTo({
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

  const handleDayClick = useCallback((day) => {
    if (day.status === 'today') {
      completeWorkout(day.weekIndex, day.dayIndex);
    } else if (day.status === 'missed') {
      makeUpWorkout(day.weekIndex, day.dayIndex);
    }
  }, [completeWorkout, makeUpWorkout]);

  // Group days by week for rendering
  const daysByWeek = useMemo(() => {
    const grouped = {};
    allDays.forEach(day => {
      if (!grouped[day.weekIndex]) {
        grouped[day.weekIndex] = [];
      }
      grouped[day.weekIndex].push(day);
    });
    return grouped;
  }, [allDays]);

  return (
    <div className="horizontal-day-scroll-container">
      <div className="month-header">
        <h3 className="month-label">{currentMonth}</h3>
      </div>
      
      <div className="horizontal-scroll-wrapper" ref={scrollContainerRef}>
        <div className="horizontal-days-container">
          {Object.keys(daysByWeek).map(weekIndex => (
            <Element 
              key={weekIndex} 
              name={`week-${weekIndex}`}
              className="week-section"
            >
              <div className="days-grid">
                <div className="days-row">
                  {daysByWeek[weekIndex].map((day, dayIndex) => (
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
            </Element>
          ))}
        </div>
      </div>
      
      {/* Week navigation dots */}
      <div className="week-navigation">
        {weeks.map((_, index) => (
          <button
            key={index}
            className={`week-dot ${index === currentWeekIndex ? 'active' : ''}`}
            onClick={() => {
              scroller.scrollTo(`week-${index}`, {
                containerId: 'horizontal-scroll-wrapper',
                duration: 300,
                smooth: true,
                horizontal: true
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalDayScroll;
