// Settings Component
export class SettingsComponent {
  constructor(options) {
    this.container = options.container;
    this.googleSheetsUrl = options.googleSheetsUrl || '';
    this.onSettingsChange = options.onSettingsChange || (() => {});
    this.onDataExport = options.onDataExport || (() => {});
    this.onDataImport = options.onDataImport || (() => {});
    this.onDataClear = options.onDataClear || (() => {});
    
    this.autoSync = true;
    
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="settings-section">
        <h3>Google Sheets Integration</h3>
        <div class="setting-item">
          <label for="google-sheets-url">Google Web App URL:</label>
          <input type="url" id="google-sheets-url" placeholder="https://script.google.com/macros/s/..." value="${this.googleSheetsUrl}" />
          <button id="test-connection-btn" class="btn-secondary">Test Connection</button>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" id="auto-sync" ${this.autoSync ? 'checked' : ''}> Auto-sync workouts to Google Sheets
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h3>Data Management</h3>
        <div class="settings-actions">
          <button id="export-data-btn" class="btn-secondary">📤 Export Local Data</button>
          <button id="import-data-btn" class="btn-secondary">📥 Import Data</button>
          <button id="clear-data-btn" class="btn-danger">🗑️ Clear All Data</button>
        </div>
      </div>

      <div class="settings-section">
        <h3>About</h3>
        <p>GymTrack v1.0 - A collaborative workout tracking app</p>
        <p>Syncs with Google Sheets for backup and collaboration</p>
        <p>Built with Tauri for cross-platform desktop and web deployment</p>
      </div>
    `;
  }

  setupEventListeners() {
    // Google Sheets URL
    this.container.querySelector('#google-sheets-url').addEventListener('change', (e) => {
      this.googleSheetsUrl = e.target.value;
      this.onSettingsChange({ googleSheetsUrl: this.googleSheetsUrl });
      window.gymTracker.showNotification('Google Sheets URL saved', 'success');
    });

    // Test connection
    this.container.querySelector('#test-connection-btn').addEventListener('click', () => {
      this.testConnection();
    });

    // Auto-sync toggle
    this.container.querySelector('#auto-sync').addEventListener('change', (e) => {
      this.autoSync = e.target.checked;
    });

    // Data management
    this.container.querySelector('#export-data-btn').addEventListener('click', () => {
      this.onDataExport();
    });

    this.container.querySelector('#import-data-btn').addEventListener('click', () => {
      this.importData();
    });

    this.container.querySelector('#clear-data-btn').addEventListener('click', () => {
      this.onDataClear();
    });
  }

  async testConnection() {
    const url = this.container.querySelector('#google-sheets-url').value;
    if (!url) {
      window.gymTracker.showNotification('Please enter a Google Sheets URL first', 'error');
      return;
    }

    try {
      const testData = {
        date: new Date().toISOString().split('T')[0],
        user: 'Test User',
        type: 'Test',
        exercises: [{
          name: 'Test Exercise',
          sets: [{ weight: '100', reps: '10' }]
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        window.gymTracker.showNotification('Connection successful! ✅', 'success');
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      window.gymTracker.showNotification('Connection failed. Check your URL.', 'error');
    }
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            this.onDataImport(data);
          } catch (error) {
            window.gymTracker.showNotification('Failed to import data. Invalid format.', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  // Public methods
  refresh() {
    // Refresh settings display if needed
  }

  updateGoogleSheetsUrl(url) {
    this.googleSheetsUrl = url;
    this.container.querySelector('#google-sheets-url').value = url;
  }

  isAutoSyncEnabled() {
    return this.autoSync;
  }
}
