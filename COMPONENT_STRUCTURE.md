# FitFlow Component-Based Architecture

This document outlines the new component-based architecture for the FitFlow gym tracking application, similar to Blazor's component system.

## Overview

The application has been restructured from a monolithic HTML file into a modular component system where each component consists of:
- **HTML Template** (`.html`) - Component markup
- **CSS Styles** (`.css`) - Component-specific styling
- **JavaScript Logic** (`.js`) - Component behavior and state management

## File Structure

```
src/
├── components/                    # Individual components
│   ├── StatusBar/
│   │   ├── StatusBar.html        # Status bar template
│   │   └── StatusBar.js          # Status bar logic
│   ├── Header/
│   │   ├── Header.html
│   │   └── Header.js
│   ├── StreakSection/
│   │   ├── StreakSection.html
│   │   └── StreakSection.js
│   ├── DaysGrid/
│   │   ├── DaysGrid.html
│   │   └── DaysGrid.js
│   ├── FriendsSection/
│   │   ├── FriendsSection.html
│   │   └── FriendsSection.js
│   └── ChallengeBanner/
│       ├── ChallengeBanner.html
│       └── ChallengeBanner.js
├── core/                         # Core system files
│   ├── App.js                    # Main application orchestrator
│   └── ComponentLoader.js        # Component loading system
├── styles/                       # All CSS files
│   ├── base.css                  # Global base styles
│   ├── status-bar.css            # StatusBar component styles
│   ├── header.css                # Header component styles
│   ├── streak-section.css        # StreakSection component styles
│   ├── days-grid.css             # DaysGrid component styles
│   ├── friends-section.css       # FriendsSection component styles
│   └── challenge-banner.css      # ChallengeBanner component styles
└── main.js                       # Application entry point
```

## Component System Features

### 1. Dynamic Component Loading
- Components are loaded on-demand using the `ComponentLoader` class
- CSS is automatically loaded from the `styles/` folder and injected into the document head
- HTML templates are rendered into designated containers
- JavaScript classes are instantiated and bound to their containers

### 2. Component Communication
- Components communicate through custom events
- The main `App` class coordinates communication between components
- Event-driven architecture allows loose coupling between components

### 3. State Management
- Each component manages its own state
- Components can be updated independently
- State changes trigger re-rendering of affected components

### 4. Lifecycle Management
- Components have initialization and cleanup methods
- The system handles component loading and unloading
- Memory management through proper cleanup

## Component Details

### StatusBar Component
- **Purpose**: Displays time and battery status
- **Features**: Auto-updating time, battery level detection
- **Events**: None (display only)

### Header Component
- **Purpose**: Shows current week information
- **Features**: Dynamic week calculation, date formatting
- **Events**: None (display only)

### StreakSection Component
- **Purpose**: Displays current workout streak
- **Features**: Animated streak counter, streak management
- **Events**: Listens for `workoutCompleted` events

### DaysGrid Component
- **Purpose**: Weekly calendar view with workout status
- **Features**: Interactive day cells, workout completion, friend avatars
- **Events**: Emits `workoutCompleted` events

### FriendsSection Component
- **Purpose**: Friends leaderboard and social features
- **Features**: Dynamic friend list, leader highlighting
- **Events**: Emits `friendSelected` events

### ChallengeBanner Component
- **Purpose**: Promotional challenge display
- **Features**: Animated banner, challenge interaction
- **Events**: Emits `challengeClicked` events

## Usage Examples

### Loading a Component Manually
```javascript
import ComponentLoader from './core/ComponentLoader.js';

const loader = new ComponentLoader();
const container = document.querySelector('#my-container');
const component = await loader.loadComponent('StatusBar', container);
```

### Component Communication
```javascript
// In a component, emit an event
this.dispatchEvent('workoutCompleted', { dayIndex: 5 });

// In the App class, listen for events
this.container.addEventListener('workoutCompleted', (event) => {
    this.handleWorkoutCompleted(event.detail);
});
```

### Updating Component State
```javascript
// Get a component instance
const streakComponent = app.getComponent('StreakSection');

// Update its state
streakComponent.setStreakCount(10);
streakComponent.incrementStreak();
```

## Benefits of This Architecture

1. **Modularity**: Each component is self-contained and can be developed independently
2. **Reusability**: Components can be reused across different parts of the application
3. **Maintainability**: Changes to one component don't affect others
4. **Testability**: Individual components can be tested in isolation
5. **Scalability**: Easy to add new components or modify existing ones
6. **Separation of Concerns**: HTML, CSS, and JavaScript are properly separated
7. **Dynamic Loading**: Components are loaded only when needed
8. **Event-Driven**: Loose coupling through event-based communication

## Migration from Original HTML

The original `index.html` has been completely dissected into:
- **Inline CSS** → Individual component CSS files + `base.css`
- **HTML Structure** → Component HTML templates
- **JavaScript Logic** → Component JavaScript classes
- **Global Styles** → `base.css` for shared styles

## Development Workflow

1. **Create New Component**: Add HTML, CSS, and JS files in component directory
2. **Register Component**: Add to component configs in `App.js`
3. **Implement Logic**: Add component-specific functionality
4. **Handle Events**: Set up component communication
5. **Test Component**: Verify functionality in isolation
6. **Integrate**: Ensure proper integration with other components

This architecture provides a solid foundation for building and maintaining a complex, interactive gym tracking application with clean separation of concerns and excellent developer experience.
