// Main Application Entry Point
import { GymTracker } from './components/GymTracker.js';
import { NavigationComponent } from './components/Navigation.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  const navigation = new NavigationComponent();
  
  // Initialize main app
  const gymTracker = new GymTracker();
  
  // Make gymTracker globally available for component callbacks
  window.gymTracker = gymTracker;
  
  console.log('🏋️ GymTrack initialized successfully!');
});
