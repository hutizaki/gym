import React, { useEffect, useRef, useMemo, useState } from 'react';
import DayCard from './DayCard';
import PageScrollIndicator from './PageScrollIndicator';
import '../styles/week-grid.css';

const WeekGrid = ({ weeksData = [], weekData = [] }) => {
  const scrollRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Flatten all days from all weeks into a single array
  const allDays = useMemo(() => {
    if (weeksData.length > 0) {
      // Flatten all days from all weeks
      return weeksData.flatMap((week, weekIndex) => 
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex,
          dayIndex,
          weekLabel: week.label
        }))
      );
    } else if (weekData.length > 0) {
      // Fallback for single week
      return weekData.map((day, dayIndex) => ({
        ...day,
        weekIndex: 0,
        dayIndex,
        weekLabel: 'This Week'
      }));
    }
    return [];
  }, [weeksData, weekData]);

  // Track scroll position to determine current card
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const containerWidth = scrollRef.current.offsetWidth;
    const scrollLeft = scrollRef.current.scrollLeft;
    
    // Calculate which card is currently visible
    // Each card takes full container width, so divide scroll position by container width
    const currentIndex = Math.round(scrollLeft / containerWidth);
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(currentIndex, allDays.length - 1));
    
    setCurrentCardIndex(boundedIndex);
  };

  useEffect(() => {
    if (scrollRef.current && allDays.length > 0) {
      // Add scroll event listener
      const scrollContainer = scrollRef.current;
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Use setTimeout to ensure layout is complete
      const timer = setTimeout(() => {
        if (!scrollRef.current) return;
        
        // Find today's card (or the most recent card)
        const today = new Date();
        const todayCardIndex = allDays.findIndex(day => 
          day.fullDate && 
          day.fullDate.toDateString() === today.toDateString()
        );
        
        // If today's card is found, scroll to it, otherwise scroll to the last card
        const targetCardIndex = todayCardIndex !== -1 ? todayCardIndex : allDays.length - 1;
        
        if (allDays.length > targetCardIndex) {
          const containerWidth = scrollRef.current.offsetWidth;
          
          // Calculate scroll position to show the target card
          const scrollPosition = targetCardIndex * containerWidth;
          
          scrollRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'instant'
          });
          
          // Update current card index after initial scroll
          setCurrentCardIndex(targetCardIndex);
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [allDays]);

  const handleDayClick = (day, cardIndex) => {
    if (day.status === 'today') {
      completeWorkout(day.weekIndex, day.dayIndex);
    } else if (day.status === 'missed') {
      makeUpWorkout(day.weekIndex, day.dayIndex);
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
        {allDays.map((day, cardIndex) => {
          // Get actual day name from the date
          const actualDayName = day.fullDate ? day.fullDate.toLocaleDateString('en-US', { weekday: 'short' }) : 'Day';
          
          return (
            <div key={`${day.weekIndex}-${day.dayIndex}`} className="day-card-container">
              <div className="day-header">
                <span className="day-label">{actualDayName}</span>
                <span className="week-label">{day.weekLabel}</span>
              </div>
              <DayCard
                day={actualDayName}
                date={day.date}
                status={day.status}
                workout={day.workout}
                friends={day.friends}
                onClick={() => handleDayClick(day, cardIndex)}
              />
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-center mb-2">
        <PageScrollIndicator numberOfPages={allDays.length} 
                            currentPage={currentCardIndex}
        />
      </div>
    </div>
  );
};

export default WeekGrid;
