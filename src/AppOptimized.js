import React, { useState, useEffect, lazy, Suspense } from 'react';
import './styles/base.css';
import { DataService } from './services/DataService';

// Lazy load components for better code splitting
const StatusBar = lazy(() => import('./components/StatusBar'));
const Header = lazy(() => import('./components/Header'));
const StreakSection = lazy(() => import('./components/StreakSection'));
const WeekGridOptimized = lazy(() => import('./components/WeekGridOptimized'));
const FriendsSection = lazy(() => import('./components/FriendsSection'));
const ChallengeBanner = lazy(() => import('./components/ChallengeBanner'));
const VersionTracker = lazy(() => import('./components/VersionTracker'));

// Loading component for better UX
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.3)',
      borderTop: '3px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function AppOptimized() {
  const [weeksData, setWeeksData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [challengeData, setChallengeData] = useState({});
  const [streakData, setStreakData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimized data loading with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use requestIdleCallback for non-critical data loading
        const loadNonCriticalData = () => {
          setWeeksData(DataService.getWeeksData());
          setFriendsData(DataService.getFriendsData());
          setChallengeData(DataService.getChallengeData());
          setStreakData(DataService.getStreakData());
          setHeaderData(DataService.getHeaderData());
          setIsLoaded(true);
        };

        if (window.requestIdleCallback) {
          window.requestIdleCallback(loadNonCriticalData, { timeout: 100 });
        } else {
          setTimeout(loadNonCriticalData, 0);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoaded(true); // Still show the app even if data loading fails
      }
    };

    loadData();
  }, []);

  // Optimized event listeners with cleanup
  useEffect(() => {
    if (!isLoaded) return;

    const handleWorkoutCompleted = (event) => {
      console.log('Workout completed:', event.detail);
    };

    const handleFriendSelected = (event) => {
      console.log('Friend selected:', event.detail.friend);
    };

    const handleChallengeClicked = (event) => {
      console.log('Challenge clicked:', event.detail.challenge);
    };

    // Use passive listeners where possible
    document.addEventListener('workoutCompleted', handleWorkoutCompleted, { passive: true });
    document.addEventListener('friendSelected', handleFriendSelected, { passive: true });
    document.addEventListener('challengeClicked', handleChallengeClicked, { passive: true });

    return () => {
      document.removeEventListener('workoutCompleted', handleWorkoutCompleted);
      document.removeEventListener('friendSelected', handleFriendSelected);
      document.removeEventListener('challengeClicked', handleChallengeClicked);
    };
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <div className="container">
        <Suspense fallback={<div style={{ height: '60px' }} />}>
          <StatusBar />
        </Suspense>
        
        <Suspense fallback={<div style={{ height: '80px', margin: '10px' }} />}>
          <Header {...headerData} />
        </Suspense>
        
        <Suspense fallback={<div style={{ height: '120px', margin: '0 10px 15px' }} />}>
          <StreakSection {...streakData} />
        </Suspense>
        
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <WeekGridOptimized weeksData={weeksData} />
        </Suspense>
        
        <Suspense fallback={<div style={{ height: '150px', margin: '0 10px' }} />}>
          <FriendsSection friendsData={friendsData} />
        </Suspense>
        
        <Suspense fallback={<div style={{ height: '80px', margin: '20px 10px' }} />}>
          <ChallengeBanner {...challengeData} />
        </Suspense>
        
        <div className="bottom-spacer"></div>
        
        <Suspense fallback={null}>
          <VersionTracker />
        </Suspense>
      </div>
    </div>
  );
}

export default AppOptimized;
