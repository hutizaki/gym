using System;
using System.Collections.Generic;

namespace gymtrack.Services
{
    public class DateService
    {
        public List<DateTime?> GenerateMonthDays(int year, int month)
        {
            var days = new List<DateTime?>();
            var firstDay = new DateTime(year, month, 1);
            int padding = (int)firstDay.DayOfWeek;

            // Fill front padding
            for (int i = 0; i < padding; i++)
                days.Add(null);

            // Add actual days
            int daysInMonth = DateTime.DaysInMonth(year, month);
            for (int day = 1; day <= daysInMonth; day++)
                days.Add(new DateTime(year, month, day));

            // Pad to 6 full weeks (6x7 = 42)
            while (days.Count < 42)
                days.Add(null);

            return days;
        }
    }
} 