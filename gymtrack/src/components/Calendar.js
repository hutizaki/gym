// Calendar Component
export class CalendarComponent {
  constructor(options) {
    this.container = options.container;
    this.workouts = options.workouts || [];
    this.currentDate = new Date();
    
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="calendar-header">
        <button id="prev-month" class="btn-secondary">‹</button>
        <h3 id="current-month">Loading...</h3>
        <button id="next-month" class="btn-secondary">›</button>
      </div>
      <div id="calendar-grid" class="calendar-grid"></div>
      <div id="workout-details" class="workout-details"></div>
    `;
    
    this.renderCalendar();
  }

  setupEventListeners() {
    this.container.querySelector('#prev-month').addEventListener('click', () => {
      this.changeMonth(-1);
    });
    
    this.container.querySelector('#next-month').addEventListener('click', () => {
      this.changeMonth(1);
    });
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.renderCalendarForMonth(year, month);
  }

  renderCalendarForMonth(year, month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    this.container.querySelector('#current-month').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarGrid = this.container.querySelector('#calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Add header row
    const headerRow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    headerRow.forEach(day => {
      const headerCell = document.createElement('div');
      headerCell.className = 'calendar-header-cell';
      headerCell.textContent = day;
      calendarGrid.appendChild(headerCell);
    });
    
    // Add calendar days
    const currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = currentDate.getDate();
      
      if (currentDate.getMonth() !== month) {
        dayElement.classList.add('other-month');
      }
      
      if (this.isToday(currentDate)) {
        dayElement.classList.add('today');
      }
      
      if (this.hasWorkoutOnDate(currentDate)) {
        dayElement.classList.add('has-workout');
      }
      
      dayElement.addEventListener('click', () => {
        this.showWorkoutDetails(new Date(currentDate));
      });
      
      calendarGrid.appendChild(dayElement);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  changeMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendar();
  }

  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  hasWorkoutOnDate(date) {
    return this.workouts.some(workout => {
      const workoutDate = new Date(workout.startTime);
      return workoutDate.toDateString() === date.toDateString();
    });
  }

  showWorkoutDetails(date) {
    const workoutsOnDate = this.workouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      return workoutDate.toDateString() === date.toDateString();
    });

    const detailsDiv = this.container.querySelector('#workout-details');
    
    if (workoutsOnDate.length === 0) {
      detailsDiv.innerHTML = `<h4>No workouts on ${date.toDateString()}</h4>`;
      detailsDiv.classList.add('show');
      return;
    }

    let html = `<h4>Workouts on ${date.toDateString()}</h4>`;
    workoutsOnDate.forEach(workout => {
      html += `
        <div class="workout-summary">
          <h5>${workout.user} - ${workout.types.join(', ')}</h5>
          <p>Duration: ${this.formatDuration(workout.duration)}</p>
          ${workout.exercises.map(exercise => `
            <div class="exercise-summary">
              <h5>${exercise.name}</h5>
              <div class="sets-summary">
                ${exercise.sets.map((set, i) => 
                  `Set ${i + 1}: ${set.weight}lbs × ${set.reps} reps`
                ).join(' | ')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    });

    detailsDiv.innerHTML = html;
    detailsDiv.classList.add('show');
  }

  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  // Public methods
  refresh() {
    this.renderCalendar();
  }

  addWorkout(workout) {
    this.workouts.push(workout);
    this.renderCalendar();
  }

  updateWorkouts(workouts) {
    this.workouts = workouts;
    this.renderCalendar();
  }
}
