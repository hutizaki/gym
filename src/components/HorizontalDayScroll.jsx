import React, { useEffect, useRef, useMemo, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import DayCard from './DayCard';
import '../styles/horizontal-day-scroll.css';

const HorizontalDayScroll = forwardRef(({ weeksData = [], weekData = [] }, ref) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [currentMonth, setCurrentMonth] = useState('');
  const [todayCardPosition, setTodayCardPosition] = useState(null);
  const containerRef = useRef(null);

  // Use weeksData if provided, otherwise fall back to single week for backward compatibility
  const weeks = useMemo(() => {
    return weeksData.length > 0 ? weeksData : [{ days: weekData, label: 'This Week' }];
  }, [weeksData, weekData]);

  // Flatten all days from all weeks into a single array for horizontal scrolling
  const allDays = useMemo(() => {
    const days = [];
    weeks.forEach((week, weekIndex) => {
      week.days.forEach((day, dayIndex) => {
        // Determine day-of-month attribute
        let dayOfMonth = null;
        if (day.fullDate) {
          const dayNumber = day.fullDate.getDate();
          const currentMonth = day.fullDate.getMonth();
          const currentYear = day.fullDate.getFullYear();
          
          // Check if this is the first day of the month
          if (dayNumber === 1) {
            dayOfMonth = 'first';
          } else {
            // Check if this is the last day of the month
            const nextDay = new Date(currentYear, currentMonth + 1, 0);
            if (dayNumber === nextDay.getDate()) {
              dayOfMonth = 'end';
            }
          }
        }
        
        days.push({
          ...day,
          weekIndex,
          dayIndex,
          actualDayName: day.fullDate 
            ? day.fullDate.toLocaleDateString('en-US', { weekday: 'short' })
            : dayNames[dayIndex],
          dayOfMonth
        });
      });
    });
    return days;
  }, [weeks, dayNames]);

  // Create month tracking data
  const monthData = useMemo(() => {
    if (allDays.length === 0) return { monthRanges: {}, months: [] };
    
    const monthRanges = {};
    const months = [];
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
    
    return { monthRanges, months };
  }, [allDays]);

  // Safely find and track the today card position
  const findTodayCardPosition = useCallback(() => {
    if (allDays.length === 0) return null;
    
    const todayIndex = allDays.findIndex(day => day.status === 'today');
    if (todayIndex !== -1) {
      return {
        index: todayIndex,
        weekIndex: allDays[todayIndex].weekIndex,
        dayIndex: allDays[todayIndex].dayIndex,
        day: allDays[todayIndex]
      };
    }
    return null;
  }, [allDays.length]); // Only depend on length, not the entire array

  // Update month label based on first day with date
  const updateCurrentMonth = useCallback(() => {
    if (allDays.length === 0) return;
    
    // Find first day with a date to show month
    const dayWithDate = allDays.find(day => day.fullDate);
    if (dayWithDate?.fullDate) {
      const monthName = dayWithDate.fullDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      setCurrentMonth(monthName);
    }
  }, [allDays]);

  // Update today card position when data changes
  useEffect(() => {
    const todayPosition = findTodayCardPosition();
    setTodayCardPosition(todayPosition);
  }, [allDays.length, findTodayCardPosition]);

  // Initialize month display
  useEffect(() => {
    updateCurrentMonth();
  }, [allDays.length, updateCurrentMonth]);

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

  // Safe method to get today card position
  const getTodayCardPosition = useCallback(() => {
    return todayCardPosition;
  }, [todayCardPosition]);

  // Safe method to check if today card exists
  const hasTodayCard = useCallback(() => {
    return todayCardPosition !== null;
  }, [todayCardPosition]);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    getTodayCardPosition,
    hasTodayCard,
    findTodayCardPosition,
    updateCurrentMonth
  }), [getTodayCardPosition, hasTodayCard, findTodayCardPosition, updateCurrentMonth]);

  return (
    <div className="horizontal-day-scroll-container">
      <div className="month-header">
        <h3 className="month-label">{currentMonth}</h3>
      </div>
      
      <div 
        className="horizontal-scroll-wrapper" 
        ref={containerRef}
        style={{ 
          overflow: 'auto',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none'  /* IE and Edge */
        }}
      >
        <div className="horizontal-days-container">
          {allDays.map((day, index) => (
            <DayCard
              key={`${day.weekIndex}-${day.dayIndex}`}
              day={day.actualDayName}
              date={day.date}
              status={day.status}
              workout={day.workout}
              friends={day.friends}
              dayOfMonth={day.dayOfMonth}
              onClick={() => handleDayClick(day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default HorizontalDayScroll;
