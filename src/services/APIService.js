// API Service for communicating with backend
export class APIService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        this.userId = 'default-user'; // Could be dynamic based on authentication
    }

    // Helper method for making API calls
    async apiCall(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            console.log(`🌐 API Call: ${config.method || 'GET'} ${url}`);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ API Response:`, data);
            return data;
        } catch (error) {
            console.error(`❌ API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    // Helper method to convert date strings back to Date objects
    convertDatesToObjects(data) {
        if (Array.isArray(data)) {
            return data.map(item => this.convertDatesToObjects(item));
        } else if (data && typeof data === 'object') {
            const converted = {};
            for (const key in data) {
                if (key === 'fullDate' && typeof data[key] === 'string') {
                    converted[key] = new Date(data[key]);
                } else if (key === 'weekStart' && typeof data[key] === 'string') {
                    converted[key] = new Date(data[key]);
                } else if (key === 'date' && typeof data[key] === 'string' && key !== 'dayOfMonth') {
                    converted[key] = new Date(data[key]);
                } else if (Array.isArray(data[key])) {
                    converted[key] = data[key].map(item => this.convertDatesToObjects(item));
                } else if (data[key] && typeof data[key] === 'object') {
                    converted[key] = this.convertDatesToObjects(data[key]);
                } else {
                    converted[key] = data[key];
                }
            }
            return converted;
        }
        return data;
    }

    // Health check
    async checkHealth() {
        try {
            return await this.apiCall('/health');
        } catch (error) {
            return { status: 'ERROR', error: error.message };
        }
    }

    // Workout methods
    async getWeeksData(userId = this.userId) {
        try {
            const data = await this.apiCall(`/weeks/${userId}`);
            return this.convertDatesToObjects(data);
        } catch (error) {
            console.error('Failed to fetch weeks data, using fallback');
            return this.getFallbackWeeksData();
        }
    }

    async getWeekData(userId = this.userId) {
        try {
            const weeks = await this.getWeeksData(userId);
            return weeks[weeks.length - 1]?.days || [];
        } catch (error) {
            console.error('Failed to fetch week data');
            return [];
        }
    }

    async saveWorkoutDay(workoutData, userId = this.userId) {
        return await this.apiCall(`/workouts/${userId}`, {
            method: 'POST',
            body: JSON.stringify(workoutData)
        });
    }

    async getUserWorkouts(userId = this.userId) {
        const data = await this.apiCall(`/workouts/${userId}`);
        return this.convertDatesToObjects(data);
    }

    // Friends methods
    async getFriendsData(userId = this.userId) {
        try {
            return await this.apiCall(`/friends/${userId}`);
        } catch (error) {
            console.error('Failed to fetch friends data, using fallback');
            return this.getFallbackFriendsData();
        }
    }

    async updateFriendStreak(friendName, newStreak, userId = this.userId) {
        return await this.apiCall(`/friends/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ friendName, newStreak })
        });
    }

    // Settings methods
    async getUserSettings(userId = this.userId) {
        try {
            return await this.apiCall(`/settings/${userId}`);
        } catch (error) {
            console.error('Failed to fetch settings, using fallback');
            return this.getFallbackSettings();
        }
    }

    async saveUserSettings(settings, userId = this.userId) {
        return await this.apiCall(`/settings/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    // Other data methods
    async getChallengeData(userId = this.userId) {
        try {
            return await this.apiCall(`/challenge/${userId}`);
        } catch (error) {
            return {
                title: '💥 Weekend Challenge',
                subtitle: 'Can you beat Sarah\'s 5-day streak?',
                isActive: true
            };
        }
    }

    async getStreakData(userId = this.userId) {
        try {
            return await this.apiCall(`/streak/${userId}`);
        } catch (error) {
            return {
                count: 4,
                label: 'Day Streak'
            };
        }
    }

    async getHeaderData(userId = this.userId) {
        try {
            return await this.apiCall(`/header/${userId}`);
        } catch (error) {
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay() + 1);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            const options = { month: 'short', day: 'numeric' };
            const year = today.getFullYear();
            
            return {
                title: 'This Week',
                subtitle: `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}, ${year}`
            };
        }
    }

    // Fallback methods (when API is unavailable)
    getFallbackWeeksData() {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay() + 1);
        
        const weeks = [];
        
        for (let weekOffset = -3; weekOffset <= 0; weekOffset++) {
            let weekData = [];
            
            if (weekOffset === 0) {
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    const dayDate = new Date(today);
                    dayDate.setDate(today.getDate() + (dayIndex - 4));
                    
                    let status = 'completed';
                    let workout = this.getRandomWorkout();
                    let friends = this.getRandomFriends();
                    
                    if (dayDate.toDateString() === today.toDateString()) {
                        status = 'today';
                        workout = '⚡';
                    } else if (dayDate > today) {
                        status = 'future';
                        workout = null;
                        friends = [];
                    } else if (Math.random() > 0.8) {
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
                const weekStart = new Date(currentWeekStart);
                weekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
                
                for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                    const dayDate = new Date(weekStart);
                    dayDate.setDate(weekStart.getDate() + dayOffset);
                    
                    let status = 'completed';
                    let workout = this.getRandomWorkout();
                    let friends = this.getRandomFriends();
                    
                    if (Math.random() > 0.8) {
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
                new Date(today.getTime() - (4 * 24 * 60 * 60 * 1000)) :
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

    getFallbackFriendsData() {
        return [
            { name: 'Sarah', streak: 5, isLeader: true, isYou: false, avatar: 'S' },
            { name: 'You', streak: 4, isLeader: false, isYou: true, avatar: 'You' },
            { name: 'Jake', streak: 3, isLeader: false, isYou: false, avatar: 'J' },
            { name: 'Alex', streak: 2, isLeader: false, isYou: false, avatar: 'A' }
        ];
    }

    getFallbackSettings() {
        return {
            autoSync: true,
            theme: 'light',
            notifications: true
        };
    }

    // Helper methods
    getRandomWorkout() {
        const workouts = ['💪', '🏃', '🏋️', '🚴', '🏊', '🧘'];
        return workouts[Math.floor(Math.random() * workouts.length)];
    }
    
    getRandomFriends() {
        const allFriends = ['S', 'M', 'A', 'J', 'K', 'L', 'B', 'C'];
        const count = Math.floor(Math.random() * 4) + 1;
        return allFriends.slice(0, count);
    }
    
    getWeekLabel(weekStart, isCurrent) {
        if (isCurrent) return 'This Week';
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
    }

    // Connection status
    async isConnected() {
        try {
            const health = await this.checkHealth();
            return health.status === 'OK';
        } catch (error) {
            return false;
        }
    }
}

// Create a singleton instance
export const apiService = new APIService();
