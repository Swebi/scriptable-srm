# SRM Widgets for iOS/MacOS

A collection of iOS/MacOS widgets built with Scriptable to display your SRM University marks and attendance information directly on your home screen.

## Features

- **Attendance Widget**: Tracks your attendance for all courses
  - Shows attendance percentage for each course
  - Calculates margin of safety/required classes
  - Color-coded indicators (Red < 75%, Yellow < 85%, Green ≥ 85%)
  - Auto-refreshes every hour

- **Marks Widget**: Shows your current marks for all theory courses
  - Displays course-wise marks with percentage
  - Color-coded indicators based on grade
  - Shows individual test performance
  - Auto-refreshes every hour


## Screenshots

<img width="370" alt="image" src="https://github.com/user-attachments/assets/a0e79ec1-2b88-4e1f-a20b-bf54e673ce59" />


## Prerequisites

- iOS/MacOS device with Scriptable app installed
- Selfhosted GoScraper API 

This project is built on top of [GoScraper](https://github.com/Rahuletto/goscraper), a powerful SRM Academia scraping tool that provides a clean API interface for accessing SRM University data.


## Installation

1. Install the [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) app from the App Store
2. Clone this repository or download the scripts
3. Copy the following files to your Scriptable folder:
   - `marks.js`
   - `attendance.js`
   - `config.js`

## Configuration

1. Open the `config.js` file in Scriptable
2. Update the following values with your GoScraper API credentials:
   ```javascript
   const config = {
     baseUrl: "https://your-goscraper-api.com,
     csrfToken: "your_csrf_token",
     authToken: "your_auth_token",
     headers: {
       "Content-Type": "application/json",
       "X-CSRF-Token": "your_csrf_token",
       "Authorization": "Bearer your_auth_token"
     }
   };
   ```

## Usage

### Adding Widgets to Home Screen

1. Long press on your home screen
2. Tap the "+" button in the top left
3. Search for "Scriptable"
4. Choose the widget size (Only Large recommended)
5. Select either "Marks" or "Attendance" script
6. Configure the widget settings if needed


## Auto-Refresh

Both widgets automatically refresh every hour to show the latest data. You can also manually refresh by tapping the widget.

