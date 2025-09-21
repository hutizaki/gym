import React from 'react';
import '../styles/challenge-banner.css';

const ChallengeBanner = ({ 
  title = '💥 Weekend Challenge', 
  subtitle = 'Can you beat Sarah\'s 5-day streak?', 
  active = true 
}) => {
  const handleChallengeClick = () => {
    const challengeData = { title, subtitle, isActive: active };
    
    // Dispatch event for challenge interaction
    document.dispatchEvent(new CustomEvent('challengeClicked', { 
      detail: { challenge: challengeData } 
    }));
  };

  return (
    <div 
      className="challenge-banner"
      style={{
        opacity: active ? '1' : '0.5',
        pointerEvents: active ? 'auto' : 'none'
      }}
      onClick={handleChallengeClick}
    >
      <div className="challenge-content">
        <div className="challenge-title">{title}</div>
        <div className="challenge-subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

export default ChallengeBanner;
