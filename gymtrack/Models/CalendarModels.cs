using System;
using System.Collections.Generic;

namespace gymtrack.Models
{
    public class MonthData
    {
        public DateTime Date { get; set; }
        public string Key { get; set; } = string.Empty;
        public List<DayData> Days { get; set; } = new();
        public Dictionary<DateTime, List<EventData>> Events { get; set; } = new();
    }

    public class DayData
    {
        public DateTime Date { get; set; }
        public bool IsCurrentMonth { get; set; }
        public bool IsToday { get; set; }
    }

    public class EventData
    {
        public DateTime Date { get; set; }
        public EventType Type { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    public enum EventType
    {
        Workout,
        Cardio,
        Rest,
        Personal
    }
} 