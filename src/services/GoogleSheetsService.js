// Google Sheets Integration Service
export class GoogleSheetsService {
  constructor() {
    this.url = '';
  }

  setUrl(url) {
    this.url = url;
  }

  async syncWorkout(workout, url = null) {
    const targetUrl = url || this.url;
    if (!targetUrl) {
      throw new Error('No Google Sheets URL configured');
    }

    const data = {
      date: workout.startTime.toISOString().split('T')[0],
      user: workout.user,
      type: workout.types.join(', '),
      exercises: workout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets.filter(set => set.weight && set.reps)
      })).filter(exercise => exercise.sets.length > 0)
    };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async testConnection(url = null) {
    const targetUrl = url || this.url;
    if (!targetUrl) {
      throw new Error('No Google Sheets URL provided');
    }

    const testData = {
      date: new Date().toISOString().split('T')[0],
      user: 'Test User',
      type: 'Test',
      exercises: [{
        name: 'Test Exercise',
        sets: [{ weight: '100', reps: '10' }]
      }]
    };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`Connection test failed: ${response.status}`);
    }

    return response;
  }

  // Batch sync multiple workouts
  async syncMultipleWorkouts(workouts, url = null) {
    const results = [];
    
    for (const workout of workouts) {
      try {
        await this.syncWorkout(workout, url);
        results.push({ workout: workout.id, success: true });
      } catch (error) {
        results.push({ workout: workout.id, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Get sync status
  getSyncStatus() {
    return {
      hasUrl: !!this.url,
      url: this.url
    };
  }
}
