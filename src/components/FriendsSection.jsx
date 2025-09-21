import React from 'react';
import '../styles/friends-section.css';

const FriendsSection = ({ 
  friendsData = [], 
  title = '🏆 This Week\'s Champions', 
  count 
}) => {
  const activeCount = count || friendsData.length;

  const handleFriendClick = (friend, friendIndex) => {
    console.log('Friend selected:', friend);
    // Dispatch event for friend selection
    document.dispatchEvent(new CustomEvent('friendSelected', { 
      detail: { friend, friendIndex } 
    }));
  };

  return (
    <div className="friends-section">
      <div className="friends-header">
        <div className="friends-title">{title}</div>
        <div className="friends-count">{activeCount} Active</div>
      </div>
      <div className="friends-grid">
        {friendsData.map((friend, index) => (
          <div
            key={index}
            className={`friend-card ${friend.isLeader ? 'leader' : ''} ${friend.isYou ? 'you' : ''}`}
            onClick={() => handleFriendClick(friend, index)}
          >
            {friend.isLeader && <div className="crown-icon">👑</div>}
            <div className={`friend-avatar-large avatar-${(index % 4) + 1}`}>
              {friend.avatar}
            </div>
            <div className="friend-name">{friend.name}</div>
            <div className="friend-streak">{friend.streak} days</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsSection;
