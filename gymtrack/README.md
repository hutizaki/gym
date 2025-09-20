# 🏋️ GymTrack - Workout Tracker

A collaborative workout tracking app that syncs with Google Sheets, built with Tauri for cross-platform desktop and web deployment.

## ✨ Features

- 📅 **Calendar view** of workout history
- 🏋️ **Track multiple workout focuses** (Push, Pull, Legs, Core, Cardio, Full Body)
- 💪 **Record exercises** with sets, weights, and reps
- ☁️ **Syncs with Google Sheets** for backup and collaboration
- 📱 **Mobile-friendly design** with responsive layout
- 🖥️ **Desktop app** powered by Tauri
- 💾 **Local storage** with offline capability
- 📤 **Export/Import** workout data
- 👥 **Multi-user support**

## 🚀 Quick Start

### Web Version
```bash
npm run dev
```
Open http://localhost:1420 in your browser

### Desktop App
```bash
npm run tauri:dev
```
This will open a native desktop window

### Production Build
```bash
npm run tauri:build
```

## 📋 Setup Instructions

### 1. Create Google Sheet (Optional)

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet
2. Name the columns:
   ```
   Timestamp | Date | User | Workout Type | Exercise | Set # | Weight | Reps
   ```

### 2. Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Replace the default code with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  data.exercises.forEach(exercise => {
    exercise.sets.forEach((set, index) => {
      sheet.appendRow([
        new Date(),                   // Timestamp
        data.date,                   // Date of workout
        data.user,                   // User name
        data.type,                   // Workout type
        exercise.name,               // Exercise name
        index + 1,                   // Set #
        set.weight,                  // Weight
        set.reps                    // Reps
      ]);
    });
  });

  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
```

3. Click **Deploy > Manage Deployments > + New Deployment**
4. Set type: **Web app**
5. Description: **GymTrackerAPI**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy** and copy the Web App URL

### 3. Configure the App

1. Open the app and go to **Settings** tab
2. Paste your Google Web App URL
3. Click **Test Connection** to verify
4. Enable **Auto-sync workouts to Google Sheets**

## 📱 Usage

1. **Select your name** from the dropdown (or add a new user)
2. **Choose workout focuses** (Push, Pull, Legs, etc.)
3. Click **"Start Workout"**
4. **Add exercises** and record your sets with weights and reps
5. Click **"Finish Workout"** to save
6. View your **workout history** in the Calendar tab

## 💾 Data Storage

- **Local data** is stored in your browser's localStorage
- **Cloud data** is stored in your Google Sheet (if configured)
- **Offline capability**: If cloud sync fails, data is still saved locally
- **Export/Import**: Backup and restore your data as JSON files

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Rust (for Tauri desktop app)

### Project Structure
```
gymtrack/
├── main.html          # Main HTML file
├── main.js           # JavaScript application logic
├── styles.css        # CSS styles
├── vite.config.js    # Vite configuration
├── package.json      # Node.js dependencies
└── src-tauri/        # Tauri desktop app configuration
    ├── src/          # Rust source code
    ├── Cargo.toml    # Rust dependencies
    └── tauri.conf.json # Tauri configuration
```

### Available Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tauri:dev` - Start Tauri desktop app in development
- `npm run tauri:build` - Build desktop app for production

### Key Features Implementation

#### 🏋️ Workout Tracking
- Real-time workout timer
- Dynamic exercise and set management
- Input validation and data persistence

#### 📅 Calendar View
- Interactive monthly calendar
- Visual indicators for workout days
- Detailed workout history on date selection

#### ☁️ Google Sheets Integration
- Async API calls to Google Apps Script
- Error handling and retry logic
- Automatic and manual sync options

#### 📱 Mobile-First Design
- Responsive CSS Grid and Flexbox layouts
- Touch-friendly interface elements
- Progressive enhancement for desktop

## 🎯 Workout Types

- **💪 Push**: Chest, Shoulders, Triceps
- **🔙 Pull**: Back, Biceps
- **🦵 Legs**: Quads, Hamstrings, Glutes
- **🎯 Core**: Abs, Obliques
- **❤️ Cardio**: Cardiovascular exercises
- **🏃 Full Body**: Compound movements

## 🔧 Configuration

### Vite Configuration
The app uses Vite with custom configuration for Tauri integration:
- Custom entry point (`main.html`)
- Development server on port 1420
- Hot module replacement enabled
- Tauri-specific build optimizations

### Tauri Configuration
- Cross-platform desktop app
- Web view integration
- Native system integration
- Auto-updater support (configurable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Google Sheets Sync Issues
- Verify your Web App URL is correct
- Check that the Apps Script is deployed with "Anyone" access
- Test the connection using the "Test Connection" button

### Desktop App Issues
- Ensure Rust is installed: `rustup update`
- Clear Tauri cache: `npm run tauri clean`
- Rebuild dependencies: `npm install`

### Development Server Issues
- Check port 1420 is available
- Clear browser cache and localStorage
- Restart the development server

---

**Happy tracking! 💪🎉**