# Real-Time Vehicle Tracker

A real-time web application that displays the live location and trip details of a single vehicle on an interactive map using Mapbox and WebSocket data.

---

### Tech Stack

- **React** (latest)
- **Redux Toolkit** for state management
- **Mapbox GL JS** for map rendering
- **Socket.IO** for real-time updates
- **TypeScript**
- **Jest + React Testing Library** (testing setup ready)

---

### Setup & Run Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/vehicle-tracker.git
cd vehicle-tracker

### 2. Install dependencies

npm install

### 3. Add Mapbox Access Token

Create your Mapbox access token:
You can get one from https://account.mapbox.com/access-tokens/

### 4. Start the backend WebSocket server

If provided, clone and run the backend server from the /src folder

cd src
npm install
npm start

The backend runs on http://localhost:3000 and sends vehicle data via WebSocket.

### 5. Start the frontend

npm run dev

Open your browser at http://localhost:5173

### Architecture Overview

src/
├── assets/              # Location icon, other assets
├── components/
│   └── VehiclePopup.tsx # Marker popup UI for vehicle info
├── screens/
│   └── LiveTracker.tsx  # Live Tracker screen
├── services/
│   └── socket.ts        # WebSocket logic (connect, subscribe, etc.)
├── store/
│   ├── index.ts         # Redux store config
│   └── vehicleSlice.ts  # Vehicle state & reducer logic
├── App.tsx              # Main component with Mapbox + marker logic
├── main.tsx             # App boot-strapper

### Data Flow

App connects to WebSocket server on mount
Subscribes to specific vehicle plate (e.g., DXB-IX-36356)
On receiving vehicleData, it:
Updates position, speed, and status in Redux
Calculates distance and average speed
Re-renders marker and popup on map


### Features

Live map with real-time marker updates
Popup showing plate number, average speed, trip mileage, and status
Responsive design (mobile + desktop)
State persistence ready (via Redux)
Clean WebSocket abstraction

### Testing Instructions

Tests are written using Jest and React Testing Library.
To run tests:

npm test

### Assumptions

Only one vehicle is tracked (plate hardcoded as DXB-IX-36356)
WebSocket server is available at http://localhost:3000
Fuel level is not required
App supports basic Mapbox styling (can be customized later)
Marker updates immediately as data comes in (no animation)
App initializes map once vehicle's first location is received
```
