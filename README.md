# ElectronTimeSheetTracker
Desktop App for tracking timesheet hours and generating CSV reports with it


[User Instructions](#Instructions)
[Tech Stack](#Tech)

## Description
Desktop app for tracking working hours. A user can make multiple projects to track working hours for.
Shifts contain  start time, end time, total break time, comments for each shift.
Users can generate reports for working hours.
Settings allow selectable options for work week start day and rounding shift minutes.



## Selecting dates
Date calendar components let users select month, date, and a year.

![](/SelectDate.png)

## Weekly Summary
Each time have a summary stats after them. The day of week the week starts on can be changed in settings.

![](/WorkWeekSummary.png)

## Summary report that can be exported to a .csv file
The report totals the hours for each individual contributor to a workspace.

![](/CreateReport.png)



## Tech
TypeScript React.js front end
TypeScript Node.js back end
SQLite database
MobX for state management with React.js
Electron.js framework to make it desktop based software using web technologies

Node.js back end with better-sqlite3 for a sql database.


# Instructions

1. git clone this repo
2. npm i
3. npm start
