// Navigation Component
export class NavigationComponent {
  constructor() {
    this.currentTab = 'workout';
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Bottom navigation click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    if (this.currentTab === tabName) return;

    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Store current tab
    this.currentTab = tabName;

    // Trigger tab-specific initialization
    this.onTabSwitch(tabName);
  }

  onTabSwitch(tabName) {
    // Emit custom event for other components to listen to
    const event = new CustomEvent('tabSwitch', { 
      detail: { tab: tabName } 
    });
    document.dispatchEvent(event);

    // Handle specific tab logic
    switch (tabName) {
      case 'calendar':
        // Calendar will re-render when it receives the tabSwitch event
        break;
      case 'settings':
        // Settings will refresh when it receives the tabSwitch event
        break;
      case 'workout':
        // Workout tab is default, no special handling needed
        break;
    }
  }

  getCurrentTab() {
    return this.currentTab;
  }
}
