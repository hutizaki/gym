export class DataService {
    static getWeeksData() {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday of current week
        
        const weeks = [];
        
        // Generate 4 weeks of data (3 past weeks + current week)
        for (let weekOffset = -3; weekOffset <= 0; weekOffset++) {
            let weekData = [];
            
            if (weekOffset === 0) {
                // Special handling for current week - build around today's date
                // Today should be at index 4, so build: [today-4, today-3, today-2, today-1, today, today+1, today+2]
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    const dayDate = new Date(today);
                    dayDate.setDate(today.getDate() + (dayIndex - 4)); // today-4 to today+2
                    
                    let status = 'completed';
                    let workout = this.getRandomWorkout();
                    let friends = this.getRandomFriends();
                    
                    // Determine status based on date
                    if (dayDate.toDateString() === today.toDateString()) {
                        status = 'today';
                        workout = '⚡';
                    } else if (dayDate > today) {
                        status = 'future';
                        workout = null;
                        friends = [];
                    } else if (Math.random() > 0.8) { // 20% chance of missed workout
                        status = 'missed';
                        workout = null;
                        friends = this.getRandomFriends().slice(0, 2);
                    }
                    
                    weekData.push({
                        date: dayDate.getDate(),
                        fullDate: dayDate,
                        status,
                        workout,
                        friends
                    });
                }
            } else {
                // Regular past weeks - use normal week structure
                const weekStart = new Date(currentWeekStart);
                weekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
                
                for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                    const dayDate = new Date(weekStart);
                    dayDate.setDate(weekStart.getDate() + dayOffset);
                    
                    let status = 'completed';
                    let workout = this.getRandomWorkout();
                    let friends = this.getRandomFriends();
                    
                    if (Math.random() > 0.8) { // 20% chance of missed workout
                        status = 'missed';
                        workout = null;
                        friends = this.getRandomFriends().slice(0, 2);
                    }
                    
                    weekData.push({
                        date: dayDate.getDate(),
                        fullDate: dayDate,
                        status,
                        workout,
                        friends
                    });
                }
            }
            
            const weekStartForLabel = weekOffset === 0 ? 
                new Date(today.getTime() - (4 * 24 * 60 * 60 * 1000)) : // today-4 for current week
                (() => {
                    const ws = new Date(currentWeekStart);
                    ws.setDate(currentWeekStart.getDate() + (weekOffset * 7));
                    return ws;
                })();
            
            weeks.push({
                weekStart: weekStartForLabel,
                days: weekData,
                label: this.getWeekLabel(weekStartForLabel, weekOffset === 0)
            });
        }
        
        return weeks;
    }
    
    static getWeekData() {
        // Keep for backward compatibility - return current week only
        const weeks = this.getWeeksData();
        return weeks[weeks.length - 1].days; // Return current week
    }
    
    static getRandomWorkout() {
        const workouts = ['💪', '🏃', '🏋️', '🚴', '🏊', '🧘'];
        return workouts[Math.floor(Math.random() * workouts.length)];
    }
    
    static getRandomFriends() {
        const allFriends = ['S', 'M', 'A', 'J', 'K', 'L', 'B', 'C'];
        const count = Math.floor(Math.random() * 4) + 1; // 1-4 friends
        return allFriends.slice(0, count);
    }
    
    static getWeekLabel(weekStart, isCurrent) {
        if (isCurrent) return 'This Week';
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
    }
    
    static getFriendsData() {
        return [
            { name: 'Sarah', streak: 5, isLeader: true, isYou: false, avatar: 'S' },
            { name: 'You', streak: 4, isLeader: false, isYou: true, avatar: 'You' },
            { name: 'Jake', streak: 3, isLeader: false, isYou: false, avatar: 'J' },
            { name: 'Alex', streak: 2, isLeader: false, isYou: false, avatar: 'A' }
        ];
    }
    
    static getChallengeData() {
        return {
            title: '💥 Weekend Challenge',
            subtitle: 'Can you beat Sarah\'s 5-day streak?',
            isActive: true
        };
    }
    
    static getStreakData() {
        return {
            count: 4,
            label: 'Day Streak'
        };
    }
    
    static getHeaderData() {
        return {
            title: 'This Week',
            subtitle: 'Sep 16 - Sep 22, 2024'
        };
    }
}