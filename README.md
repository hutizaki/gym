# Workout Tracker

A collaborative workout tracking app that syncs with Google Sheets.

## Features

- 📅 Calendar view of workout history
- 🏋️ Track multiple workout focuses
- 💪 Record exercises with sets, weights, and reps
- ☁️ Syncs with Google Sheets for backup and collaboration
- 📱 Mobile-friendly design

## Setup Instructions

### 1. Create Google Sheet

1. Go to [Google Sheets](https://sheets.new) and create a new sheet
2. Name the columns:
   ```
   Timestamp | Date | User | Workout Type | Exercise | Set # | Weight | Reps
   ```

### 2. Set Up Google Apps Script

1. In your Google Sheet, go to `Extensions > Apps Script`
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

3. Click `Deploy > Manage Deployments > + New Deployment`
   - Set type: **Web app**
   - Description: `GymTrackerAPI`
   - Execute as: `Me`
   - Who has access: `Anyone`
4. Click `Deploy` and copy the Web App URL

### 3. Update the App

1. Open `gymtracker.html`
2. Replace `YOUR_GOOGLE_WEB_APP_URL_HERE` with your Web App URL

## Usage

1. Select your name from the dropdown
2. Choose one or more workout focuses
3. Click "Start Workout"
4. Add exercises and record your sets
5. Click "Finish Workout" to save

Your workout will be saved both locally and to your Google Sheet!

## Data Storage

- Local data is stored in your browser's localStorage
- Cloud data is stored in your Google Sheet
- If cloud sync fails, data is still saved locally

## Contributing

Feel free to submit issues and enhancement requests!
