import React, { useState, useEffect } from 'react';
import './styles/base.css';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import StreakSection from './components/StreakSection';
import HorizontalDayScroll from './components/HorizontalDayScroll';
import FriendsSection from './components/FriendsSection';
import ChallengeBanner from './components/ChallengeBanner';
import VersionTracker from './components/VersionTracker';
import { DataService } from './services/DataService';

function App() {
  const [weeksData, setWeeksData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [challengeData, setChallengeData] = useState({});
  const [streakData, setStreakData] = useState({});
  const [headerData, setHeaderData] = useState({});

  useEffect(() => {
    // Load data from DataService
    setWeeksData(DataService.getWeeksData());
    setFriendsData(DataService.getFriendsData());
    setChallengeData(DataService.getChallengeData());
    setStreakData(DataService.getStreakData());
    setHeaderData(DataService.getHeaderData());

    // Set up global event listeners
    const handleWorkoutCompleted = (event) => {
      console.log('Workout completed:', event.detail);
    };

    const handleFriendSelected = (event) => {
      console.log('Friend selected:', event.detail.friend);
    };

    const handleChallengeClicked = (event) => {
      console.log('Challenge clicked:', event.detail.challenge);
    };

    document.addEventListener('workoutCompleted', handleWorkoutCompleted);
    document.addEventListener('friendSelected', handleFriendSelected);
    document.addEventListener('challengeClicked', handleChallengeClicked);

    return () => {
      document.removeEventListener('workoutCompleted', handleWorkoutCompleted);
      document.removeEventListener('friendSelected', handleFriendSelected);
      document.removeEventListener('challengeClicked', handleChallengeClicked);
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <StatusBar />
        <Header {...headerData} />
        <StreakSection {...streakData} />
        <HorizontalDayScroll weeksData={weeksData} />
        <FriendsSection friendsData={friendsData} />
        <ChallengeBanner {...challengeData} />
        <div className="bottom-spacer"></div>
        <VersionTracker />
      </div>
    </div>
  );
}

export default App;
