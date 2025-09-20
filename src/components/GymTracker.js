// Main GymTracker Application Component
import { WorkoutComponent } from './Workout.js';
import { CalendarComponent } from './Calendar.js';
import { SettingsComponent } from './Settings.js';
import { NotificationService } from '../services/NotificationService.js';
import { StorageService } from '../services/StorageService.js';
import { GoogleSheetsService } from '../services/GoogleSheetsService.js';

export class GymTracker {
  constructor() {
    // Initialize services
    this.notificationService = new NotificationService();
    this.storageService = new StorageService();
    this.googleSheetsService = new GoogleSheetsService();
    
    // Initialize data
    this.users = this.storageService.getUsers();
    this.workouts = this.storageService.getWorkouts();
    this.googleSheetsUrl = this.storageService.getGoogleSheetsUrl();
    
    // Initialize components
    this.workoutComponent = null;
    this.calendarComponent = null;
    this.settingsComponent = null;
    
    this.init();
  }

  init() {
    this.initializeComponents();
    this.setupEventListeners();
  }

  initializeComponents() {
    // Initialize workout component
    this.workoutComponent = new WorkoutComponent({
      container: document.getElementById('workout-content'),
      users: this.users,
      onWorkoutComplete: this.handleWorkoutComplete.bind(this),
      onUserAdded: this.handleUserAdded.bind(this)
    });

    // Initialize calendar component
    this.calendarComponent = new CalendarComponent({
      container: document.getElementById('calendar-content'),
      workouts: this.workouts
    });

    // Initialize settings component
    this.settingsComponent = new SettingsComponent({
      container: document.getElementById('settings-content'),
      googleSheetsUrl: this.googleSheetsUrl,
      onSettingsChange: this.handleSettingsChange.bind(this),
      onDataExport: this.handleDataExport.bind(this),
      onDataImport: this.handleDataImport.bind(this),
      onDataClear: this.handleDataClear.bind(this)
    });
  }

  setupEventListeners() {
    // Listen for tab switches
    document.addEventListener('tabSwitch', (e) => {
      const { tab } = e.detail;
      this.handleTabSwitch(tab);
    });
  }

  handleTabSwitch(tab) {
    switch (tab) {
      case 'calendar':
        this.calendarComponent.refresh();
        break;
      case 'settings':
        this.settingsComponent.refresh();
        break;
    }
  }

  // Event Handlers
  handleWorkoutComplete(workout) {
    // Save workout
    this.workouts.push(workout);
    this.storageService.saveWorkouts(this.workouts);

    // Sync to Google Sheets if enabled
    if (this.settingsComponent.isAutoSyncEnabled() && this.googleSheetsUrl) {
      this.googleSheetsService.syncWorkout(workout, this.googleSheetsUrl)
        .then(() => {
          this.notificationService.show('Synced to Google Sheets! ☁️', 'success');
        })
        .catch(() => {
          this.notificationService.show('Failed to sync to Google Sheets', 'error');
        });
    }

    // Update calendar
    this.calendarComponent.addWorkout(workout);
    
    this.notificationService.show('Workout completed and saved! 🎉', 'success');
  }

  handleUserAdded(user) {
    this.users.push(user);
    this.storageService.saveUsers(this.users);
    this.notificationService.show('User added successfully!', 'success');
  }

  handleSettingsChange(settings) {
    if (settings.googleSheetsUrl !== undefined) {
      this.googleSheetsUrl = settings.googleSheetsUrl;
      this.storageService.saveGoogleSheetsUrl(this.googleSheetsUrl);
      this.googleSheetsService.setUrl(this.googleSheetsUrl);
    }
  }

  handleDataExport() {
    const data = {
      users: this.users,
      workouts: this.workouts,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymtrack-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.notificationService.show('Data exported successfully! 📤', 'success');
  }

  handleDataImport(data) {
    try {
      if (data.users && data.workouts) {
        this.users = [...new Set([...this.users, ...data.users])];
        this.workouts = [...this.workouts, ...data.workouts];
        
        this.storageService.saveUsers(this.users);
        this.storageService.saveWorkouts(this.workouts);
        
        // Refresh components
        this.workoutComponent.updateUsers(this.users);
        this.calendarComponent.updateWorkouts(this.workouts);
        
        this.notificationService.show('Data imported successfully! 📥', 'success');
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      this.notificationService.show('Failed to import data. Invalid format.', 'error');
    }
  }

  handleDataClear() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      if (confirm('This will delete all workouts and users. Are you absolutely sure?')) {
        this.storageService.clearAll();
        this.users = ['Bryan', 'Partner', 'Friend'];
        this.workouts = [];
        this.googleSheetsUrl = '';
        
        // Refresh all components
        this.workoutComponent.updateUsers(this.users);
        this.calendarComponent.updateWorkouts(this.workouts);
        this.settingsComponent.updateGoogleSheetsUrl('');
        
        this.notificationService.show('All data cleared', 'info');
      }
    }
  }

  // Public API
  getUsers() {
    return this.users;
  }

  getWorkouts() {
    return this.workouts;
  }

  showNotification(message, type = 'info') {
    this.notificationService.show(message, type);
  }
}
