// Local Storage Service
export class StorageService {
  constructor() {
    this.keys = {
      users: 'gymtrack-users',
      workouts: 'gymtrack-workouts',
      googleSheetsUrl: 'googleSheetsUrl',
      settings: 'gymtrack-settings'
    };
  }

  // Users
  getUsers() {
    const saved = localStorage.getItem(this.keys.users);
    return saved ? JSON.parse(saved) : ['Bryan', 'Partner', 'Friend'];
  }

  saveUsers(users) {
    localStorage.setItem(this.keys.users, JSON.stringify(users));
  }

  // Workouts
  getWorkouts() {
    const saved = localStorage.getItem(this.keys.workouts);
    return saved ? JSON.parse(saved) : [];
  }

  saveWorkouts(workouts) {
    localStorage.setItem(this.keys.workouts, JSON.stringify(workouts));
  }

  // Google Sheets URL
  getGoogleSheetsUrl() {
    return localStorage.getItem(this.keys.googleSheetsUrl) || '';
  }

  saveGoogleSheetsUrl(url) {
    localStorage.setItem(this.keys.googleSheetsUrl, url);
  }

  // Settings
  getSettings() {
    const saved = localStorage.getItem(this.keys.settings);
    return saved ? JSON.parse(saved) : {
      autoSync: true,
      theme: 'light',
      notifications: true
    };
  }

  saveSettings(settings) {
    localStorage.setItem(this.keys.settings, JSON.stringify(settings));
  }

  // Clear all data
  clearAll() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Export all data
  exportAll() {
    return {
      users: this.getUsers(),
      workouts: this.getWorkouts(),
      googleSheetsUrl: this.getGoogleSheetsUrl(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
  }

  // Import data
  importAll(data) {
    if (data.users) this.saveUsers(data.users);
    if (data.workouts) this.saveWorkouts(data.workouts);
    if (data.googleSheetsUrl) this.saveGoogleSheetsUrl(data.googleSheetsUrl);
    if (data.settings) this.saveSettings(data.settings);
  }
}
