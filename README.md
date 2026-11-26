# WaitWise — Smart Waiting-Time Estimation and Queue Load Management

A beginner-friendly SDLC website project built with **HTML, CSS and JavaScript**. It runs in a browser and saves demo queue data in `localStorage`.

## Run the project
1. Download and extract `WaitWise_Project.zip`.
2. Open the `WaitWise_Project` folder.
3. Double-click `index.html` to open it in Chrome or Edge.
4. For easier development, open the folder in Visual Studio Code and use the Live Server extension.

No installation, database, or API key is required for this demo.

## Features
- Generate sequential queue tokens.
- Show the live waiting list, current token, and next token.
- Estimate waiting time using average service duration.
- Let staff change average service duration.
- Staff can serve the next token or reset the demo queue.
- Show busy and less-busy periods as illustrative sample guidance.
- Responsive layout for mobile and desktop.
- Save queue data in browser local storage.

## Important limitations
This is a complete **front-end demonstration**, not a production multi-user queue system. `localStorage` is limited to the current browser/device, so visitors and staff on different devices will not see the same queue. The staff panel has no login. Busy periods are sample guidance, not calculated from real historical records.

## Suggested future upgrades
- Backend API (Node.js + Express) and database (MySQL / MongoDB).
- Staff login and role-based access.
- Shared real-time queue updates across devices.
- Store historical arrival and service timestamps.
- Calculate actual peak hours from stored records.
- Train a machine-learning model using historical queue data.

## SDLC mapping
1. **Requirements analysis:** identify visitors, office staff, tokens, queue status, and wait-time needs.
2. **System design:** visitor token form, live queue, staff panel, and wait-time calculation.
3. **Implementation:** HTML structure, CSS styling, JavaScript queue logic, and local storage.
4. **Testing:** generate multiple tokens, change service time, serve tokens, reset queue, and test on mobile.
5. **Maintenance:** fix bugs, improve accessibility, add authentication, backend storage, and ML prediction.

## Basic wait-time logic
Estimated wait = number of people ahead × average service duration. The demo also counts the currently served token as one service interval for people waiting behind it.
