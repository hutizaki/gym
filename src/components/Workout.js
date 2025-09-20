// Workout Component
export class WorkoutComponent {
  constructor(options) {
    this.container = options.container;
    this.users = options.users || [];
    this.onWorkoutComplete = options.onWorkoutComplete || (() => {});
    this.onUserAdded = options.onUserAdded || (() => {});
    
    this.currentWorkout = null;
    this.workoutTimer = null;
    this.workoutStartTime = null;
    
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <!-- User Selection -->
      <div class="user-section">
        <label for="user-select">Select User:</label>
        <select id="user-select">
          <option value="">Choose your name...</option>
          ${this.users.map(user => `<option value="${user}">${user}</option>`).join('')}
        </select>
        <button id="add-user-btn" class="btn-secondary">+ Add User</button>
      </div>

      <!-- Workout Type Selection -->
      <div class="workout-type-section">
        <label>Workout Focus:</label>
        <div class="workout-types">
          <label class="checkbox-label">
            <input type="checkbox" value="Push"> 💪 Push (Chest, Shoulders, Triceps)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="Pull"> 🔙 Pull (Back, Biceps)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="Legs"> 🦵 Legs (Quads, Hamstrings, Glutes)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="Core"> 🎯 Core (Abs, Obliques)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="Cardio"> ❤️ Cardio
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="Full Body"> 🏃 Full Body
          </label>
        </div>
      </div>

      <!-- Start Workout Button -->
      <button id="start-workout-btn" class="btn-primary" disabled>Start Workout</button>

      <!-- Active Workout Section -->
      <div id="active-workout" class="workout-section" style="display: none;">
        <div class="workout-header">
          <h3>Active Workout</h3>
          <div class="workout-info">
            <span id="workout-user"></span> • <span id="workout-types"></span>
          </div>
          <div class="workout-timer">
            <span id="workout-time">00:00</span>
          </div>
        </div>

        <div id="exercise-list" class="exercise-list"></div>

        <div class="add-exercise-section">
          <input type="text" id="exercise-name" placeholder="Enter exercise name..." />
          <button id="add-exercise-btn" class="btn-secondary">+ Add Exercise</button>
        </div>

        <div class="workout-actions">
          <button id="finish-workout-btn" class="btn-success">✅ Finish Workout</button>
          <button id="cancel-workout-btn" class="btn-danger">❌ Cancel Workout</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // User selection
    this.container.querySelector('#user-select').addEventListener('change', () => {
      this.checkStartWorkoutButton();
    });

    // Workout type checkboxes
    this.container.querySelectorAll('.workout-types input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.checkStartWorkoutButton();
      });
    });

    // Start workout
    this.container.querySelector('#start-workout-btn').addEventListener('click', () => {
      this.startWorkout();
    });

    // Add exercise
    this.container.querySelector('#add-exercise-btn').addEventListener('click', () => {
      this.addExercise();
    });

    this.container.querySelector('#exercise-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addExercise();
    });

    // Finish/Cancel workout
    this.container.querySelector('#finish-workout-btn').addEventListener('click', () => {
      this.finishWorkout();
    });

    this.container.querySelector('#cancel-workout-btn').addEventListener('click', () => {
      this.cancelWorkout();
    });
  }

  checkStartWorkoutButton() {
    const user = this.container.querySelector('#user-select').value;
    const selectedTypes = Array.from(this.container.querySelectorAll('.workout-types input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    
    const startBtn = this.container.querySelector('#start-workout-btn');
    startBtn.disabled = !user || selectedTypes.length === 0;
  }

  startWorkout() {
    const user = this.container.querySelector('#user-select').value;
    const selectedTypes = Array.from(this.container.querySelectorAll('.workout-types input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    this.currentWorkout = {
      id: Date.now(),
      user: user,
      types: selectedTypes,
      startTime: new Date(),
      exercises: []
    };

    this.workoutStartTime = Date.now();
    this.startWorkoutTimer();

    this.container.querySelector('#workout-user').textContent = user;
    this.container.querySelector('#workout-types').textContent = selectedTypes.join(', ');
    this.container.querySelector('#active-workout').style.display = 'block';
    this.container.querySelector('#start-workout-btn').style.display = 'none';

    window.gymTracker.showNotification('Workout started! 💪', 'success');
  }

  startWorkoutTimer() {
    this.workoutTimer = setInterval(() => {
      const elapsed = Date.now() - this.workoutStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      this.container.querySelector('#workout-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  addExercise() {
    const exerciseName = this.container.querySelector('#exercise-name').value.trim();
    if (!exerciseName || !this.currentWorkout) return;

    const exercise = {
      id: Date.now(),
      name: exerciseName,
      sets: [{ weight: '', reps: '' }]
    };

    this.currentWorkout.exercises.push(exercise);
    this.renderExercise(exercise);
    this.container.querySelector('#exercise-name').value = '';
  }

  renderExercise(exercise) {
    const exerciseList = this.container.querySelector('#exercise-list');
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise-item';
    exerciseDiv.dataset.exerciseId = exercise.id;

    exerciseDiv.innerHTML = `
      <div class="exercise-header">
        <span class="exercise-name">${exercise.name}</span>
        <button class="remove-exercise" onclick="window.gymTracker.workoutComponent.removeExercise(${exercise.id})">×</button>
      </div>
      <div class="sets-container" id="sets-${exercise.id}">
        ${this.renderSets(exercise)}
      </div>
      <button class="add-set-btn" onclick="window.gymTracker.workoutComponent.addSet(${exercise.id})">+ Add Set</button>
    `;

    exerciseList.appendChild(exerciseDiv);
  }

  renderSets(exercise) {
    return exercise.sets.map((set, index) => `
      <div class="set-row">
        <span class="set-number">Set ${index + 1}</span>
        <input type="number" class="set-input" placeholder="Weight" value="${set.weight}" 
               onchange="window.gymTracker.workoutComponent.updateSet(${exercise.id}, ${index}, 'weight', this.value)">
        <input type="number" class="set-input" placeholder="Reps" value="${set.reps}"
               onchange="window.gymTracker.workoutComponent.updateSet(${exercise.id}, ${index}, 'reps', this.value)">
        <button class="remove-set" onclick="window.gymTracker.workoutComponent.removeSet(${exercise.id}, ${index})">Remove</button>
      </div>
    `).join('');
  }

  addSet(exerciseId) {
    const exercise = this.currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      exercise.sets.push({ weight: '', reps: '' });
      this.container.querySelector(`#sets-${exerciseId}`).innerHTML = this.renderSets(exercise);
    }
  }

  removeSet(exerciseId, setIndex) {
    const exercise = this.currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.sets.length > 1) {
      exercise.sets.splice(setIndex, 1);
      this.container.querySelector(`#sets-${exerciseId}`).innerHTML = this.renderSets(exercise);
    }
  }

  updateSet(exerciseId, setIndex, field, value) {
    const exercise = this.currentWorkout.exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.sets[setIndex]) {
      exercise.sets[setIndex][field] = value;
    }
  }

  removeExercise(exerciseId) {
    if (confirm('Remove this exercise?')) {
      this.currentWorkout.exercises = this.currentWorkout.exercises.filter(ex => ex.id !== exerciseId);
      this.container.querySelector(`[data-exercise-id="${exerciseId}"]`).remove();
    }
  }

  finishWorkout() {
    if (!this.currentWorkout) return;

    this.currentWorkout.endTime = new Date();
    this.currentWorkout.duration = Date.now() - this.workoutStartTime;

    this.onWorkoutComplete(this.currentWorkout);
    this.resetWorkoutUI();
  }

  cancelWorkout() {
    if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
      this.resetWorkoutUI();
      window.gymTracker.showNotification('Workout cancelled', 'info');
    }
  }

  resetWorkoutUI() {
    if (this.workoutTimer) {
      clearInterval(this.workoutTimer);
      this.workoutTimer = null;
    }

    this.currentWorkout = null;
    this.workoutStartTime = null;
    this.container.querySelector('#active-workout').style.display = 'none';
    this.container.querySelector('#start-workout-btn').style.display = 'block';
    this.container.querySelector('#exercise-list').innerHTML = '';
    this.container.querySelector('#exercise-name').value = '';
    this.container.querySelector('#workout-time').textContent = '00:00';

    this.container.querySelectorAll('.workout-types input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.checkStartWorkoutButton();
  }

  updateUsers(users) {
    this.users = users;
    const select = this.container.querySelector('#user-select');
    const currentValue = select.value;
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }

    // Add user options
    this.users.forEach(user => {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      select.appendChild(option);
    });

    // Restore selection if it still exists
    if (this.users.includes(currentValue)) {
      select.value = currentValue;
    }
  }
}
