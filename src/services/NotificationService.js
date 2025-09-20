// Notification Service
export class NotificationService {
  constructor() {
    this.notificationElement = document.getElementById('notification');
    this.currentTimeout = null;
  }

  show(message, type = 'info', duration = 3000) {
    // Clear any existing timeout
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }

    // Update notification content and style
    this.notificationElement.textContent = message;
    this.notificationElement.className = `notification ${type} show`;
    
    // Auto-hide after duration
    this.currentTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.notificationElement.classList.remove('show');
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 4000) {
    this.show(message, 'error', duration);
  }

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }

  warning(message, duration = 3500) {
    this.show(message, 'warning', duration);
  }
}
