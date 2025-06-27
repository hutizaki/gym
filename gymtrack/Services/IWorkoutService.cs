using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using gymtrack.Models;

namespace gymtrack.Services
{
    public interface IWorkoutService
    {
        Task<List<EventData>> GetWorkoutsForMonthAsync(DateTime monthDate);
        Task<EventData> AddWorkoutAsync(DateTime date, string workoutType);
        Task<bool> DeleteWorkoutAsync(int workoutId);
    }
} 