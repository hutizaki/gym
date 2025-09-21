import React, { useState, useEffect } from 'react';
import '../styles/status-bar.css';

const StatusBar = ({ time = '9:41', battery = '100%' }) => {
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(timeString);
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update battery if available
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const percentage = Math.round(battery.level * 100);
        // You could set this in state if needed
        console.log('Battery level:', percentage);
      });
    }
  }, []);

  return (
    <div className="status-bar">
      <div className="time">{currentTime}</div>
      <div className="spacer"></div>
      <div className="battery">{battery}</div>
    </div>
  );
};

export default StatusBar;
