using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using gymtrack.Models;

namespace gymtrack.Services
{
    public class WorkoutService : IWorkoutService
    {
        private readonly HttpClient _httpClient;
        private readonly List<EventData> _mockWorkouts;
        
        public WorkoutService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            
            // Initialize with some mock data for demonstration
            _mockWorkouts = new List<EventData>
            {
                new EventData 
                { 
                    Date = DateTime.Today.AddDays(-5), 
                    Type = EventType.Workout, 
                    Title = "Chest & Triceps",
                    Description = "Bench press, dips, tricep extensions"
                },
                new EventData 
                { 
                    Date = DateTime.Today.AddDays(-3), 
                    Type = EventType.Cardio, 
                    Title = "Morning Run",
                    Description = "5km jog in the park"
                },
                new EventData 
                { 
                    Date = DateTime.Today.AddDays(-1), 
                    Type = EventType.Workout, 
                    Title = "Back & Biceps",
                    Description = "Pull-ups, rows, curls"
                },
                new EventData 
                { 
                    Date = DateTime.Today, 
                    Type = EventType.Rest, 
                    Title = "Rest Day",
                    Description = "Recovery and stretching"
                }
            };
        }
        
        public async Task<List<EventData>> GetWorkoutsForMonthAsync(DateTime monthDate)
        {
            // Simulate async operation
            await Task.Delay(100);
            
            var startDate = new DateTime(monthDate.Year, monthDate.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            
            // Return mock workouts for the requested month
            var workoutsForMonth = _mockWorkouts.FindAll(w => 
                w.Date >= startDate && w.Date <= endDate);
                
            return workoutsForMonth;
        }
        
        public async Task<EventData> AddWorkoutAsync(DateTime date, string workoutType)
        {
            await Task.Delay(50);
            
            var workout = new EventData
            {
                Date = date,
                Type = Enum.Parse<EventType>(workoutType, true),
                Title = $"New {workoutType}",
                Description = "Added via calendar"
            };
            
            _mockWorkouts.Add(workout);
            return workout;
        }
        
        public async Task<bool> DeleteWorkoutAsync(int workoutId)
        {
            await Task.Delay(50);
            // Mock deletion - always return success
            return true;
        }
    }
} 