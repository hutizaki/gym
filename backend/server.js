const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection
let db = null;
let client = null;

async function connectToMongoDB() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gymtrack?retryWrites=true&w=majority';
        
        if (mongoUri.includes('username:password')) {
            console.log('⚠️  Using default MongoDB URI. Please set MONGODB_URI in .env file');
            console.log('📝 Create a .env file in the backend folder with your actual MongoDB connection string');
            return false;
        }

        client = new MongoClient(mongoUri);
        await client.connect();
        db = client.db('gymtrack');
        
        console.log('✅ Connected to MongoDB Atlas');
        console.log('🔍 Database object set:', !!db);
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        return false;
    }
}

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
    origin: ['http://localhost:3000', 'https://hutizaki.github.io'], // React app URLs
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        mongodb: db ? 'connected' : 'disconnected'
    });
});

// Workout Routes
app.get('/api/workouts', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = 'default-user';
        const collection = db.collection('workouts');
        
        const workouts = await collection.find({ userId }).toArray();
        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
});

app.get('/api/workouts/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const collection = db.collection('workouts');
        
        const workouts = await collection.find({ userId }).toArray();
        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
});

app.post('/api/workouts', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = 'default-user';
        const workoutData = req.body;
        const collection = db.collection('workouts');
        
        const workout = {
            userId,
            date: new Date(workoutData.fullDate),
            dayOfMonth: workoutData.date,
            status: workoutData.status,
            workout: workoutData.workout,
            friends: workoutData.friends || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Use upsert to update existing or create new
        const result = await collection.replaceOne(
            { 
                userId, 
                date: new Date(workoutData.fullDate)
            },
            workout,
            { upsert: true }
        );

        console.log(`💾 Workout saved for user ${userId}:`, result);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error saving workout:', error);
        res.status(500).json({ error: 'Failed to save workout' });
    }
});

app.post('/api/workouts/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const workoutData = req.body;
        const collection = db.collection('workouts');
        
        const workout = {
            userId,
            date: new Date(workoutData.fullDate),
            dayOfMonth: workoutData.date,
            status: workoutData.status,
            workout: workoutData.workout,
            friends: workoutData.friends || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Use upsert to update existing or create new
        const result = await collection.replaceOne(
            { 
                userId, 
                date: new Date(workoutData.fullDate)
            },
            workout,
            { upsert: true }
        );

        console.log(`💾 Workout saved for user ${userId}:`, result);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error saving workout:', error);
        res.status(500).json({ error: 'Failed to save workout' });
    }
});

// Friends Routes
app.get('/api/friends', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = 'default-user';
        const collection = db.collection('friends');
        
        let friends = await collection.findOne({ userId });
        
        // Return default data if none exists
        if (!friends) {
            const defaultFriends = {
                userId,
                friends: [
                    { name: 'Sarah', streak: 5, isLeader: true, isYou: false, avatar: 'S' },
                    { name: 'You', streak: 4, isLeader: false, isYou: true, avatar: 'You' },
                    { name: 'Jake', streak: 3, isLeader: false, isYou: false, avatar: 'J' },
                    { name: 'Alex', streak: 2, isLeader: false, isYou: false, avatar: 'A' }
                ],
                createdAt: new Date()
            };
            
            // Save default data
            await collection.insertOne(defaultFriends);
            friends = defaultFriends;
        }
        
        res.json(friends.friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});

app.get('/api/friends/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const collection = db.collection('friends');
        
        let friends = await collection.findOne({ userId });
        
        // Return default data if none exists
        if (!friends) {
            const defaultFriends = {
                userId,
                friends: [
                    { name: 'Sarah', streak: 5, isLeader: true, isYou: false, avatar: 'S' },
                    { name: 'You', streak: 4, isLeader: false, isYou: true, avatar: 'You' },
                    { name: 'Jake', streak: 3, isLeader: false, isYou: false, avatar: 'J' },
                    { name: 'Alex', streak: 2, isLeader: false, isYou: false, avatar: 'A' }
                ],
                createdAt: new Date()
            };
            
            // Save default data
            await collection.insertOne(defaultFriends);
            friends = defaultFriends;
        }
        
        res.json(friends.friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});

app.put('/api/friends/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const { friendName, newStreak } = req.body;
        const collection = db.collection('friends');
        
        const result = await collection.updateOne(
            { userId, 'friends.name': friendName },
            { 
                $set: { 
                    'friends.$.streak': newStreak,
                    updatedAt: new Date()
                }
            }
        );
        
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error updating friend streak:', error);
        res.status(500).json({ error: 'Failed to update friend streak' });
    }
});

// Settings Routes
app.get('/api/settings/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const collection = db.collection('settings');
        
        let settings = await collection.findOne({ userId });
        
        if (!settings) {
            const defaultSettings = {
                userId,
                autoSync: true,
                theme: 'light',
                notifications: true,
                createdAt: new Date()
            };
            
            await collection.insertOne(defaultSettings);
            settings = defaultSettings;
        }
        
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

app.put('/api/settings/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const settings = req.body;
        const collection = db.collection('settings');
        
        const result = await collection.replaceOne(
            { userId },
            {
                userId,
                ...settings,
                updatedAt: new Date()
            },
            { upsert: true }
        );
        
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// Challenge and Streak Routes (computed from workout data)
app.get('/api/challenge/:userId', async (req, res) => {
    try {
        // Static challenge data for now
        res.json({
            title: '💥 Weekend Challenge',
            subtitle: 'Can you beat Sarah\'s 5-day streak?',
            isActive: true
        });
    } catch (error) {
        console.error('Error fetching challenge:', error);
        res.status(500).json({ error: 'Failed to fetch challenge' });
    }
});

app.get('/api/streak/:userId', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const userId = req.params.userId;
        const collection = db.collection('workouts');
        
        // Calculate streak from recent workouts
        const workouts = await collection.find({ userId }).sort({ date: -1 }).limit(30).toArray();
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            
            const workout = workouts.find(w => 
                new Date(w.date).toDateString() === checkDate.toDateString()
            );
            
            if (workout && workout.status === 'completed') {
                streak++;
            } else {
                break;
            }
        }
        
        res.json({
            count: streak,
            label: 'Day Streak'
        });
    } catch (error) {
        console.error('Error calculating streak:', error);
        res.status(500).json({ 
            count: 4,
            label: 'Day Streak'
        });
    }
});

app.get('/api/header/:userId', async (req, res) => {
    try {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        const year = today.getFullYear();
        
        res.json({
            title: 'This Week',
            subtitle: `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}, ${year}`
        });
    } catch (error) {
        console.error('Error generating header:', error);
        res.status(500).json({ error: 'Failed to generate header' });
    }
});

// Weeks data endpoint (main data for the app)
app.get('/api/weeks/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Get saved workouts from database
        let savedWorkouts = [];
        if (db) {
            const collection = db.collection('workouts');
            savedWorkouts = await collection.find({ userId }).toArray();
        }
        
        // Create a map for quick lookup
        const workoutMap = new Map();
        savedWorkouts.forEach(workout => {
            const dateKey = new Date(workout.date).toDateString();
            workoutMap.set(dateKey, workout);
        });

        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday of current week
        
        const weeks = [];
        
        // Generate 4 weeks of data (3 past weeks + current week)
        for (let weekOffset = -3; weekOffset <= 0; weekOffset++) {
            let weekData = [];
            
            if (weekOffset === 0) {
                // Special handling for current week - build around today's date
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    const dayDate = new Date(today);
                    dayDate.setDate(today.getDate() + (dayIndex - 4)); // today-4 to today+2
                    
                    const dateKey = dayDate.toDateString();
                    const savedWorkout = workoutMap.get(dateKey);
                    
                    let status = 'completed';
                    let workout = getRandomWorkout();
                    let friends = getRandomFriends();
                    
                    // Use saved data if available
                    if (savedWorkout) {
                        status = savedWorkout.status;
                        workout = savedWorkout.workout;
                        friends = savedWorkout.friends;
                    } else {
                        // Determine status based on date for new entries
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
                            friends = getRandomFriends().slice(0, 2);
                        }
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
                    
                    const dateKey = dayDate.toDateString();
                    const savedWorkout = workoutMap.get(dateKey);
                    
                    let status = 'completed';
                    let workout = getRandomWorkout();
                    let friends = getRandomFriends();
                    
                    // Use saved data if available
                    if (savedWorkout) {
                        status = savedWorkout.status;
                        workout = savedWorkout.workout;
                        friends = savedWorkout.friends;
                    } else if (Math.random() > 0.8) { // 20% chance of missed workout
                        status = 'missed';
                        workout = null;
                        friends = getRandomFriends().slice(0, 2);
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
                label: getWeekLabel(weekStartForLabel, weekOffset === 0)
            });
        }
        
        res.json(weeks);
    } catch (error) {
        console.error('Error generating weeks data:', error);
        res.status(500).json({ error: 'Failed to generate weeks data' });
    }
});

// Helper functions
function getRandomWorkout() {
    const workouts = ['💪', '🏃', '🏋️', '🚴', '🏊', '🧘'];
    return workouts[Math.floor(Math.random() * workouts.length)];
}

function getRandomFriends() {
    const allFriends = ['S', 'M', 'A', 'J', 'K', 'L', 'B', 'C'];
    const count = Math.floor(Math.random() * 4) + 1; // 1-4 friends
    return allFriends.slice(0, count);
}

function getWeekLabel(weekStart, isCurrent) {
    if (isCurrent) return 'This Week';
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (client) {
        await client.close();
        console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
});

// Start server
async function startServer() {
    const mongoConnected = await connectToMongoDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        
        if (!mongoConnected) {
            console.log('⚠️  Server started without MongoDB connection');
            console.log('📝 API will return mock data until MongoDB is configured');
        }
    });
}

startServer().catch(console.error);
