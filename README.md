# FitFlow - Gym Tracking App

A React-based gym tracking application with a modern web interface and backend API.

## Features

- **Weekly View**: Track your workouts for the current week
- **Streak Tracking**: Monitor your workout streak
- **Social Features**: See friends' progress and compete
- **Challenges**: Participate in weekly fitness challenges
- **Real-time Updates**: Live time and battery status

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Styling**: CSS3 with modern features
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the full-stack development environment:
   ```bash
   ./start-fullstack.sh
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:8000) servers.

### Building for Production

```bash
# Build React app
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── StreakSection.jsx
│   ├── WeekGrid.jsx
│   ├── DayCard.jsx
│   ├── FriendsSection.jsx
│   ├── ChallengeBanner.jsx
│   └── StatusBar.jsx
├── services/           # Data services
│   └── DataService.js
├── App.js              # Main app component
├── App.css             # Main styles
├── index.js            # React entry point
└── index.css           # Global styles
```

## Components

### WeekGrid
Displays the weekly calendar with workout status for each day.

### StreakSection
Shows the current workout streak with animated counter.

### FriendsSection
Social leaderboard showing friends' progress.

### ChallengeBanner
Promotional banner for weekly challenges.

## Development

The app uses React with functional components and hooks for state management. All styling is done with CSS3, and the app is designed as a modern web application with a Node.js backend API.

## License

MIT License